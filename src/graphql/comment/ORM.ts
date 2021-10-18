import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

import type { comment } from '../../database/sobok'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils'
import { buildSQL, getColumnsFromFields, serializeParameters } from '../common/ORM'
import type { Comment } from '../generated/graphql'
import { userFieldColumnMapping } from '../user/ORM'
import parentComment from './sql/parentComment.sql'
import user from './sql/user.sql'

// GraphQL fields -> Database columns
export function commentFieldColumnMapping(commentField: keyof Comment) {
  switch (commentField) {
    case 'parentComment':
    case 'feed':
    case 'user':
      return ''
    default:
      return `comment.${camelToSnake(commentField)}`
  }
}

export function buildBasicCommentQuery(info: GraphQLResolveInfo) {
  const commentFields = graphqlFields(info)
  const commentFieldsSet = new Set(Object.keys(commentFields))

  let sql = ''
  let columns = getColumnsFromFields(commentFields, commentFieldColumnMapping)
  const values: unknown[] = []

  if (commentFieldsSet.has('parentComment')) {
    const commentColumns = getColumnsFromFields(
      commentFields.parentComment,
      commentFieldColumnMapping
    ).map((tableColumn) => {
      const column = tableColumn.split('.')[1]
      return `parent_comment.${column} AS parent_comment__${column}`
    })

    sql = buildSQL(sql, 'JOIN', parentComment)
    columns = [...columns, ...commentColumns]
  }

  // if (commentFieldsSet.has('feed')) {
  // }

  if (commentFieldsSet.has('user')) {
    const userColumns = getColumnsFromFields(commentFields.user, userFieldColumnMapping)
    sql = buildSQL(sql, 'JOIN', user)
    columns = [...columns, ...userColumns]
  }

  return [`SELECT ${columns} FROM "comment" ${serializeParameters(sql)}` as string, values] as const
}

// SQL response -> GraphQL response
export function commentORM(comment: Partial<comment>): any {
  return {
    ...snakeKeyToCamelKey(comment),
  }
}
