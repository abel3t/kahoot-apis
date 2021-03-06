import { AsyncExecutor } from '@graphql-tools/utils';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fetch } from 'cross-fetch';
import { GraphQLSchema, print } from 'graphql';

import { getForwardedIp, getIp } from '../../common/helpers/req.helper';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class StitchingService {
  constructor(
    private readonly logger: LoggerService,
    private configService: ConfigService
  ) {}

  public async schemas(): Promise<Array<GraphQLSchema | null>> {
    const apiUrls = this.configService.get<string[]>('GraphQL_URLs');
    return Promise.all(
      Object.values(apiUrls).map((url) => this.getApiSchema(url))
    );
  }

  private async getApiSchema(api_link: string): Promise<GraphQLSchema | null> {
    this.logger.info(`Parse ${api_link}`);

    try {
      const executor: AsyncExecutor = async ({
        document,
        variables,
        context
      }) => {
        this.logger.info(`Request to ${api_link}`);

        const query = print(document);

        let currentUser = '{}';
        let remoteAddress = '-';
        let forwardedAddress = '-';

        if (context?.req) {
          currentUser = JSON.stringify(context.req.user || {});
          remoteAddress = getIp(context.req);
          forwardedAddress = getForwardedIp(context.req);
        }

        const fetch_result = await fetch(api_link, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            currentUser,
            remoteAddress,
            forwardedAddress
          },
          body: JSON.stringify({ query, variables })
        });

        return fetch_result.json();
      };

      return wrapSchema({
        schema: await introspectSchema(executor),
        executor
      });
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }
}
