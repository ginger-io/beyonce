import { AttributeMap } from "aws-sdk/clients/dynamodb"
import { PartitionAndSortKey } from "../keys"
import { TaggedModel } from "../types"
import { BaseParams } from "./BaseParams"

export interface GetItemParams<T extends TaggedModel> extends BaseParams {
  key: PartitionAndSortKey<T>
  consistentRead?: boolean
}

export interface GetItemResult {
  item?: AttributeMap
}

export async function getItem<T extends TaggedModel>(params: GetItemParams<T>): Promise<GetItemResult> {
  const { table, client, key, consistentRead } = params
  const results = await client
    .get({
      TableName: table.tableName,
      ConsistentRead: consistentRead,
      Key: {
        [table.partitionKeyName]: key.partitionKey,
        [table.sortKeyName]: key.sortKey
      }
    })
    .promise()

  return { item: results.Item }
}
