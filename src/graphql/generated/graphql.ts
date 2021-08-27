/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
  DateTime: any
  EmailAddress: any
  JWT: any
  NonEmptyString: any
  URL: any
}

export type Bucket = {
  __typename?: 'Bucket'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  name: Scalars['NonEmptyString']
  /** from other table */
  user: User
}

export type Comment = {
  __typename?: 'Comment'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  contents: Array<Scalars['NonEmptyString']>
  /** nullable */
  imageUrl?: Maybe<Scalars['URL']>
  /** from other table */
  feed: Feed
  user: User
  /** from other table - nullable */
  comment?: Maybe<Comment>
}

export type Feed = {
  __typename?: 'Feed'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  rating: Scalars['NonEmptyString']
  contents: Array<Scalars['NonEmptyString']>
  imageUrls: Array<Scalars['URL']>
  likeCount: Scalars['Int']
  commentCount: Scalars['Int']
  /** from other table */
  user: User
  /** from other table - nullable */
  comments?: Maybe<Array<Comment>>
  hashtags?: Maybe<Array<Scalars['NonEmptyString']>>
  menus?: Maybe<Array<Menu>>
  store?: Maybe<Store>
}

/** 성별 */
export enum Gender {
  Other = 'OTHER',
  Male = 'MALE',
  Female = 'FEMALE',
}

export type Menu = {
  __typename?: 'Menu'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  name: Scalars['NonEmptyString']
  price: Scalars['Int']
  imageUrls: Array<Scalars['URL']>
  category: Scalars['NonEmptyString']
  /** 로그인한 사용자가 이 메뉴를 버킷에 담은 여부 */
  isInBucket: Scalars['Boolean']
  /** 로그인한 사용자가 이 메뉴를 좋아하는 여부 */
  isLiked: Scalars['Boolean']
  /** 이 메뉴를 판매하는 매장 */
  store: Store
  /** 메뉴에 달린 해시태그 */
  hashtags?: Maybe<Array<Scalars['NonEmptyString']>>
}

export type Mutation = {
  __typename?: 'Mutation'
  /** 회원가입에 필요한 정보를 주면 성공했을 때 인증 토큰을 반환한다. */
  register: Scalars['JWT']
  /** 회원탈퇴 시 사용자 정보가 모두 초기화된다. */
  unregister: Scalars['Boolean']
  /** 이메일과 1번 해싱한 비밀번호를 전송하면 인증 토큰을 반환한다. */
  login: Scalars['JWT']
  /** 인증 토큰과 같이 요청하면 로그아웃 성공 여부를 반환한다. */
  logout: Scalars['Boolean']
}

export type MutationRegisterArgs = {
  input: RegisterInput
}

export type MutationLoginArgs = {
  email: Scalars['EmailAddress']
  passwordHash: Scalars['NonEmptyString']
}

export type News = {
  __typename?: 'News'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  title: Scalars['NonEmptyString']
  contents: Array<Scalars['NonEmptyString']>
  category: Scalars['NonEmptyString']
  /** nullable */
  imageUrls?: Maybe<Array<Scalars['URL']>>
  /** from other table */
  isLiked: Scalars['Boolean']
  store: Store
}

/** OAuth 공급자 */
export enum Provider {
  Sobok = 'SOBOK',
  Google = 'GOOGLE',
  Naver = 'NAVER',
  Kakao = 'KAKAO',
}

export type Query = {
  __typename?: 'Query'
  feed?: Maybe<Feed>
  feedList?: Maybe<Array<Feed>>
  feedList2?: Maybe<Array<Feed>>
  /** 이메일 중복 여부 검사 */
  isEmailUnique: Scalars['Boolean']
  /** 사용자 고유 이름 중복 여부 검사 */
  isUniqueNameUnique: Scalars['Boolean']
  /** 인증 토큰과 같이 요청하면 사용자 정보를 반환 */
  me: User
  menu?: Maybe<Menu>
  menu2?: Maybe<Menu>
  menus?: Maybe<Array<Menu>>
  menus2?: Maybe<Array<Menu>>
  news?: Maybe<News>
  newsList?: Maybe<Array<News>>
  newsList2?: Maybe<Array<News>>
  /** 특정 매장 정보 */
  store?: Maybe<Store>
  /** 동네 및 카테고리별 매장 목록 */
  stores: Array<Store>
}

export type QueryFeedArgs = {
  id: Scalars['ID']
}

export type QueryFeedListArgs = {
  storeId: Scalars['ID']
}

export type QueryFeedList2Args = {
  town: Scalars['ID']
}

export type QueryIsEmailUniqueArgs = {
  email: Scalars['EmailAddress']
}

export type QueryIsUniqueNameUniqueArgs = {
  uniqueName: Scalars['NonEmptyString']
}

export type QueryMenuArgs = {
  id: Scalars['ID']
}

export type QueryMenu2Args = {
  storeId: Scalars['ID']
  name: Scalars['NonEmptyString']
}

export type QueryMenusArgs = {
  town?: Maybe<Scalars['NonEmptyString']>
  category?: Maybe<Scalars['NonEmptyString']>
}

export type QueryMenus2Args = {
  storeId?: Maybe<Scalars['ID']>
}

export type QueryNewsArgs = {
  id: Scalars['ID']
}

export type QueryNewsList2Args = {
  storeId: Scalars['ID']
}

export type QueryStoreArgs = {
  id: Scalars['ID']
}

export type QueryStoresArgs = {
  town?: Maybe<Scalars['NonEmptyString']>
  categories?: Maybe<Array<Scalars['NonEmptyString']>>
}

export type RegisterInput = {
  uniqueName: Scalars['NonEmptyString']
  email: Scalars['EmailAddress']
  passwordHash: Scalars['NonEmptyString']
  name: Scalars['NonEmptyString']
  phone: Scalars['NonEmptyString']
  gender: Gender
  bio?: Maybe<Scalars['String']>
  birth?: Maybe<Scalars['Date']>
  imageUrl?: Maybe<Scalars['URL']>
}

export type Store = {
  __typename?: 'Store'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  name: Scalars['NonEmptyString']
  town: Scalars['NonEmptyString']
  address: Scalars['NonEmptyString']
  categories: Array<Scalars['NonEmptyString']>
  takeout: Scalars['Boolean']
  /** nullable */
  tel?: Maybe<Scalars['String']>
  registrationNumber?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  businessHours?: Maybe<Array<Scalars['NonEmptyString']>>
  holidays?: Maybe<Array<Scalars['Date']>>
  imageUrls?: Maybe<Array<Scalars['URL']>>
  userId: Scalars['ID']
  /** from other table */
  isInBucket: Scalars['Boolean']
  isLiked: Scalars['Boolean']
  menus: Array<Menu>
  /** from other table - nullable */
  hashtags?: Maybe<Array<Scalars['NonEmptyString']>>
  user?: Maybe<User>
}

export type Trend = {
  __typename?: 'Trend'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  contents: Array<Scalars['NonEmptyString']>
  /** from other table */
  user: User
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  uniqueName: Scalars['NonEmptyString']
  email: Scalars['EmailAddress']
  name: Scalars['NonEmptyString']
  phone: Scalars['NonEmptyString']
  gender: Gender
  isEmailVerified: Scalars['Boolean']
  isStarUser: Scalars['Boolean']
  providers: Array<Provider>
  bio?: Maybe<Scalars['String']>
  birth?: Maybe<Scalars['Date']>
  imageUrl?: Maybe<Scalars['URL']>
  /** 내가 쓴 댓글 */
  comments?: Maybe<Array<Comment>>
  /** 내가 쓴 피드 */
  feed?: Maybe<Array<Feed>>
  /** 내 메뉴 버킷 리스트 */
  menuBuckets?: Maybe<Array<Bucket>>
  /** 내 매장 버킷 리스트 */
  storeBuckets?: Maybe<Array<Bucket>>
  /** 사용자가 따르고 있는 다른 사용자 */
  followings?: Maybe<Array<User>>
  /** 사용자를 따르는 다른 사용자 */
  followers?: Maybe<Array<User>>
  /** 좋아요 누른 댓글 */
  likedComments?: Maybe<Array<Comment>>
  /** 좋아요 누른 피드 */
  likedFeed?: Maybe<Array<Feed>>
  /** 좋아요 누른 메뉴 */
  likedMenus?: Maybe<Array<Menu>>
  /** 좋아요 누른 소식 */
  likedNews?: Maybe<Array<News>>
  /** 좋아요 누른 매장 */
  likedStores?: Maybe<Array<Store>>
  /** 좋아요 누른 트렌드 */
  likedTrends?: Maybe<Array<Trend>>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Bucket: ResolverTypeWrapper<Bucket>
  ID: ResolverTypeWrapper<Scalars['ID']>
  Comment: ResolverTypeWrapper<Comment>
  Date: ResolverTypeWrapper<Scalars['Date']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>
  Feed: ResolverTypeWrapper<Feed>
  Int: ResolverTypeWrapper<Scalars['Int']>
  Gender: Gender
  JWT: ResolverTypeWrapper<Scalars['JWT']>
  Menu: ResolverTypeWrapper<Menu>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Mutation: ResolverTypeWrapper<{}>
  News: ResolverTypeWrapper<News>
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>
  Provider: Provider
  Query: ResolverTypeWrapper<{}>
  RegisterInput: RegisterInput
  String: ResolverTypeWrapper<Scalars['String']>
  Store: ResolverTypeWrapper<Store>
  Trend: ResolverTypeWrapper<Trend>
  URL: ResolverTypeWrapper<Scalars['URL']>
  User: ResolverTypeWrapper<User>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Bucket: Bucket
  ID: Scalars['ID']
  Comment: Comment
  Date: Scalars['Date']
  DateTime: Scalars['DateTime']
  EmailAddress: Scalars['EmailAddress']
  Feed: Feed
  Int: Scalars['Int']
  JWT: Scalars['JWT']
  Menu: Menu
  Boolean: Scalars['Boolean']
  Mutation: {}
  News: News
  NonEmptyString: Scalars['NonEmptyString']
  Query: {}
  RegisterInput: RegisterInput
  String: Scalars['String']
  Store: Store
  Trend: Trend
  URL: Scalars['URL']
  User: User
}

export type BucketResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Bucket'] = ResolversParentTypes['Bucket']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type CommentResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  contents?: Resolver<Array<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  imageUrl?: Resolver<Maybe<ResolversTypes['URL']>, ParentType, ContextType>
  feed?: Resolver<ResolversTypes['Feed'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress'
}

export type FeedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Feed'] = ResolversParentTypes['Feed']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  rating?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  contents?: Resolver<Array<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  imageUrls?: Resolver<Array<ResolversTypes['URL']>, ParentType, ContextType>
  likeCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>
  hashtags?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
  menus?: Resolver<Maybe<Array<ResolversTypes['Menu']>>, ParentType, ContextType>
  store?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JWT'], any> {
  name: 'JWT'
}

export type MenuResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Menu'] = ResolversParentTypes['Menu']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  imageUrls?: Resolver<Array<ResolversTypes['URL']>, ParentType, ContextType>
  category?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  isInBucket?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType>
  hashtags?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  register?: Resolver<
    ResolversTypes['JWT'],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, 'input'>
  >
  unregister?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  login?: Resolver<
    ResolversTypes['JWT'],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'email' | 'passwordHash'>
  >
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
}

export type NewsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['News'] = ResolversParentTypes['News']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  title?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  contents?: Resolver<Array<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  category?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<ResolversTypes['URL']>>, ParentType, ContextType>
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface NonEmptyStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['NonEmptyString'], any> {
  name: 'NonEmptyString'
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  feed?: Resolver<
    Maybe<ResolversTypes['Feed']>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedArgs, 'id'>
  >
  feedList?: Resolver<
    Maybe<Array<ResolversTypes['Feed']>>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedListArgs, 'storeId'>
  >
  feedList2?: Resolver<
    Maybe<Array<ResolversTypes['Feed']>>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedList2Args, 'town'>
  >
  isEmailUnique?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryIsEmailUniqueArgs, 'email'>
  >
  isUniqueNameUnique?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryIsUniqueNameUniqueArgs, 'uniqueName'>
  >
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  menu?: Resolver<
    Maybe<ResolversTypes['Menu']>,
    ParentType,
    ContextType,
    RequireFields<QueryMenuArgs, 'id'>
  >
  menu2?: Resolver<
    Maybe<ResolversTypes['Menu']>,
    ParentType,
    ContextType,
    RequireFields<QueryMenu2Args, 'storeId' | 'name'>
  >
  menus?: Resolver<
    Maybe<Array<ResolversTypes['Menu']>>,
    ParentType,
    ContextType,
    RequireFields<QueryMenusArgs, never>
  >
  menus2?: Resolver<
    Maybe<Array<ResolversTypes['Menu']>>,
    ParentType,
    ContextType,
    RequireFields<QueryMenus2Args, never>
  >
  news?: Resolver<
    Maybe<ResolversTypes['News']>,
    ParentType,
    ContextType,
    RequireFields<QueryNewsArgs, 'id'>
  >
  newsList?: Resolver<Maybe<Array<ResolversTypes['News']>>, ParentType, ContextType>
  newsList2?: Resolver<
    Maybe<Array<ResolversTypes['News']>>,
    ParentType,
    ContextType,
    RequireFields<QueryNewsList2Args, 'storeId'>
  >
  store?: Resolver<
    Maybe<ResolversTypes['Store']>,
    ParentType,
    ContextType,
    RequireFields<QueryStoreArgs, 'id'>
  >
  stores?: Resolver<
    Array<ResolversTypes['Store']>,
    ParentType,
    ContextType,
    RequireFields<QueryStoresArgs, never>
  >
}

export type StoreResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  town?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  address?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  categories?: Resolver<Array<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  takeout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  tel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  registrationNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  businessHours?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
  holidays?: Resolver<Maybe<Array<ResolversTypes['Date']>>, ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<ResolversTypes['URL']>>, ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isInBucket?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  menus?: Resolver<Array<ResolversTypes['Menu']>, ParentType, ContextType>
  hashtags?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type TrendResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Trend'] = ResolversParentTypes['Trend']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  contents?: Resolver<Array<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL'
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  uniqueName?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  phone?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  gender?: Resolver<ResolversTypes['Gender'], ParentType, ContextType>
  isEmailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isStarUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  providers?: Resolver<Array<ResolversTypes['Provider']>, ParentType, ContextType>
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  birth?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  imageUrl?: Resolver<Maybe<ResolversTypes['URL']>, ParentType, ContextType>
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>
  feed?: Resolver<Maybe<Array<ResolversTypes['Feed']>>, ParentType, ContextType>
  menuBuckets?: Resolver<Maybe<Array<ResolversTypes['Bucket']>>, ParentType, ContextType>
  storeBuckets?: Resolver<Maybe<Array<ResolversTypes['Bucket']>>, ParentType, ContextType>
  followings?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>
  followers?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>
  likedComments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>
  likedFeed?: Resolver<Maybe<Array<ResolversTypes['Feed']>>, ParentType, ContextType>
  likedMenus?: Resolver<Maybe<Array<ResolversTypes['Menu']>>, ParentType, ContextType>
  likedNews?: Resolver<Maybe<Array<ResolversTypes['News']>>, ParentType, ContextType>
  likedStores?: Resolver<Maybe<Array<ResolversTypes['Store']>>, ParentType, ContextType>
  likedTrends?: Resolver<Maybe<Array<ResolversTypes['Trend']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  Bucket?: BucketResolvers<ContextType>
  Comment?: CommentResolvers<ContextType>
  Date?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  EmailAddress?: GraphQLScalarType
  Feed?: FeedResolvers<ContextType>
  JWT?: GraphQLScalarType
  Menu?: MenuResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  News?: NewsResolvers<ContextType>
  NonEmptyString?: GraphQLScalarType
  Query?: QueryResolvers<ContextType>
  Store?: StoreResolvers<ContextType>
  Trend?: TrendResolvers<ContextType>
  URL?: GraphQLScalarType
  User?: UserResolvers<ContextType>
}
