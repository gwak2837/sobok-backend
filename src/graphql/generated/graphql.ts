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
  type: BucketType
  userId: Scalars['ID']
  /** 버킷 소유자 */
  user: User
}

export enum BucketType {
  Store = 'STORE',
  Menu = 'MENU',
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
  storeId: Scalars['ID']
  userId: Scalars['ID']
  /** 피드 좋아요 여부 (로그인 필요) */
  isLiked: Scalars['Boolean']
  /** 피드에 태그된 매장 */
  store: Store
  /** 피드 작성자 */
  user: User
  /** 피드에 달린 댓글 */
  comments?: Maybe<Array<Comment>>
  /** 피드에 달린 해시태그 */
  hashtags?: Maybe<Array<Scalars['NonEmptyString']>>
  /** 피드에 태그된 메뉴 목록 */
  menus?: Maybe<Array<Menu>>
}

/** 기본값: ALL_USER */
export enum FeedOptions {
  StarUser = 'STAR_USER',
  /** 로그인 필요 */
  FollowingUser = 'FOLLOWING_USER',
  AllUser = 'ALL_USER',
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
  isSoldOut: Scalars['Boolean']
  imageUrls: Array<Scalars['URL']>
  category: Scalars['NonEmptyString']
  storeId: Scalars['ID']
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
  /** 고유 이름 또는 이메일과 비밀번호를 전송하면 JWT 인증 토큰을 반환함 */
  login?: Maybe<UserAuthentication>
  /** JWT 인증 토큰과 같이 요청하면 로그아웃 성공 여부를 반환함 */
  logout: Scalars['Boolean']
  /** 회원가입에 필요한 정보를 주면 성공했을 때 인증 토큰을 반환함 */
  register?: Maybe<UserAuthentication>
  /** 회원탈퇴 시 사용자 정보가 모두 초기화됩 */
  unregister: Scalars['Boolean']
}

export type MutationLoginArgs = {
  uniqueNameOrEmail: Scalars['NonEmptyString']
  passwordHash: Scalars['NonEmptyString']
}

export type MutationRegisterArgs = {
  input: RegisterInput
}

export type News = {
  __typename?: 'News'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  title: Scalars['NonEmptyString']
  contents: Array<Scalars['NonEmptyString']>
  category: Scalars['NonEmptyString']
  storeId: Scalars['ID']
  imageUrls?: Maybe<Array<Scalars['URL']>>
  /** 뉴스 좋아요 여부 (로그인 필요) */
  isLiked: Scalars['Boolean']
  /** 이 소식을 올린 매장 */
  store: Store
}

/** 기본값: ALL_STORE */
export enum NewsOptions {
  /** 로그인 필요 */
  LikedStore = 'LIKED_STORE',
  AllStore = 'ALL_STORE',
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
  /** 버켓 상세 정보 */
  bucket?: Maybe<Bucket>
  /** 메뉴 또는 매장 버킷 리스트를 반환, 로그인 상태 또는 userId를 입력해야 함 */
  buckets?: Maybe<Array<Bucket>>
  /** 피드 상세 */
  feed?: Maybe<Feed>
  /** 특정 매장 피드 목록 */
  feedListByStore?: Maybe<Array<Feed>>
  /** 특정 동네 피드 목록 */
  feedListByTown?: Maybe<Array<Feed>>
  /** 이메일 중복 여부 검사 */
  isEmailUnique: Scalars['Boolean']
  /** 사용자 고유 이름 중복 여부 검사 */
  isUniqueNameUnique: Scalars['Boolean']
  /** 인증 토큰과 같이 요청하면 사용자 정보를 반환 */
  me?: Maybe<User>
  /** 메뉴 상세 */
  menu?: Maybe<Menu>
  /** 메뉴 상세 */
  menuByName?: Maybe<Menu>
  /** 특정 매장 메뉴 목록 */
  menusByStore?: Maybe<Array<Menu>>
  /** 특정 동네 및 특정 카테고리 피드 목록 */
  menusByTownAndCategory?: Maybe<Array<Menu>>
  /** 메뉴 버킷에만 해당 */
  menusInBucket?: Maybe<Array<Menu>>
  /** 소식 상세 */
  news?: Maybe<News>
  /** 특정 매장 소식 목록 */
  newsListByStore?: Maybe<Array<News>>
  /** 옵션별 여러 매장 소식 목록 */
  newsListByTown?: Maybe<Array<News>>
  searchFeed?: Maybe<Array<Menu>>
  searchMenus?: Maybe<Array<Menu>>
  searchStores?: Maybe<Array<Menu>>
  /** 특정 매장 정보 */
  store?: Maybe<Store>
  /** 동네 및 카테고리별 매장 목록 */
  storesByTownAndCategory?: Maybe<Array<Store>>
  /** 매장 버킷에만 해당 */
  storesInBucket?: Maybe<Array<Store>>
}

export type QueryBucketArgs = {
  id: Scalars['ID']
}

export type QueryBucketsArgs = {
  type: BucketType
  userUniqueName?: Maybe<Scalars['NonEmptyString']>
}

export type QueryFeedArgs = {
  id: Scalars['ID']
}

export type QueryFeedListByStoreArgs = {
  storeId: Scalars['ID']
}

export type QueryFeedListByTownArgs = {
  town?: Maybe<Scalars['NonEmptyString']>
  option?: Maybe<FeedOptions>
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

export type QueryMenuByNameArgs = {
  storeId: Scalars['ID']
  name: Scalars['NonEmptyString']
}

export type QueryMenusByStoreArgs = {
  storeId: Scalars['ID']
}

export type QueryMenusByTownAndCategoryArgs = {
  town?: Maybe<Scalars['NonEmptyString']>
  category?: Maybe<Scalars['NonEmptyString']>
}

export type QueryMenusInBucketArgs = {
  bucketId: Scalars['ID']
  userUniqueName: Scalars['NonEmptyString']
}

export type QueryNewsArgs = {
  id: Scalars['ID']
}

export type QueryNewsListByStoreArgs = {
  storeId: Scalars['ID']
  categories?: Maybe<Array<Scalars['NonEmptyString']>>
}

export type QueryNewsListByTownArgs = {
  town?: Maybe<Scalars['NonEmptyString']>
  option?: Maybe<NewsOptions>
  categories?: Maybe<Array<Scalars['NonEmptyString']>>
}

export type QuerySearchFeedArgs = {
  hashtags: Array<Scalars['NonEmptyString']>
}

export type QuerySearchMenusArgs = {
  hashtags: Array<Scalars['NonEmptyString']>
}

export type QuerySearchStoresArgs = {
  hashtags: Array<Scalars['NonEmptyString']>
}

export type QueryStoreArgs = {
  id: Scalars['ID']
}

export type QueryStoresByTownAndCategoryArgs = {
  town?: Maybe<Scalars['NonEmptyString']>
  categories?: Maybe<Array<Scalars['NonEmptyString']>>
}

export type QueryStoresInBucketArgs = {
  bucketId: Scalars['ID']
  userUniqueName: Scalars['NonEmptyString']
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
  tel?: Maybe<Scalars['String']>
  registrationNumber?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  businessHours?: Maybe<Array<Scalars['NonEmptyString']>>
  holidays?: Maybe<Array<Scalars['Date']>>
  imageUrls?: Maybe<Array<Scalars['URL']>>
  userId: Scalars['ID']
  /** 로그인한 사용자가 이 매장을 버킷에 담은 여부 */
  isInBucket: Scalars['Boolean']
  /** 로그인한 사용자가 이 매장을 좋아하는 여부 */
  isLiked: Scalars['Boolean']
  /** 매장에서 판매하는 메뉴 목록 */
  menus: Array<Menu>
  /** 매장에 달린 해시태그 */
  hashtags?: Maybe<Array<Scalars['NonEmptyString']>>
  /** 매장에서 올린 소식 목록 */
  news?: Maybe<Array<News>>
  /** 매장을 소유한 사용자 정보 */
  user?: Maybe<User>
}

export type Trend = {
  __typename?: 'Trend'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  contents: Array<Scalars['NonEmptyString']>
  /** 트렌드 작성자 */
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
  nickname?: Maybe<Scalars['String']>
  /** 내가 쓴 댓글 */
  comments?: Maybe<Array<Comment>>
  /** 내가 쓴 피드 */
  feed?: Maybe<Array<Feed>>
  /** 내가 소유한 매장 */
  stores?: Maybe<Array<Store>>
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
  /** 내 메뉴 버킷 리스트 */
  menuBuckets?: Maybe<Array<Bucket>>
  /** 내 매장 버킷 리스트 */
  storeBuckets?: Maybe<Array<Bucket>>
}

export type UserAuthentication = {
  __typename?: 'UserAuthentication'
  userUniqueName: Scalars['NonEmptyString']
  jwt: Scalars['JWT']
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
  BucketType: BucketType
  Comment: ResolverTypeWrapper<Comment>
  Date: ResolverTypeWrapper<Scalars['Date']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>
  Feed: ResolverTypeWrapper<Feed>
  Int: ResolverTypeWrapper<Scalars['Int']>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  FeedOptions: FeedOptions
  Gender: Gender
  JWT: ResolverTypeWrapper<Scalars['JWT']>
  Menu: ResolverTypeWrapper<Menu>
  Mutation: ResolverTypeWrapper<{}>
  News: ResolverTypeWrapper<News>
  NewsOptions: NewsOptions
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>
  Provider: Provider
  Query: ResolverTypeWrapper<{}>
  RegisterInput: RegisterInput
  String: ResolverTypeWrapper<Scalars['String']>
  Store: ResolverTypeWrapper<Store>
  Trend: ResolverTypeWrapper<Trend>
  URL: ResolverTypeWrapper<Scalars['URL']>
  User: ResolverTypeWrapper<User>
  UserAuthentication: ResolverTypeWrapper<UserAuthentication>
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
  Boolean: Scalars['Boolean']
  JWT: Scalars['JWT']
  Menu: Menu
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
  UserAuthentication: UserAuthentication
}

export type BucketResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Bucket'] = ResolversParentTypes['Bucket']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  type?: Resolver<ResolversTypes['BucketType'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
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
  storeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>
  hashtags?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
  menus?: Resolver<Maybe<Array<ResolversTypes['Menu']>>, ParentType, ContextType>
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
  isSoldOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  imageUrls?: Resolver<Array<ResolversTypes['URL']>, ParentType, ContextType>
  category?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  storeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
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
  login?: Resolver<
    Maybe<ResolversTypes['UserAuthentication']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'uniqueNameOrEmail' | 'passwordHash'>
  >
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  register?: Resolver<
    Maybe<ResolversTypes['UserAuthentication']>,
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, 'input'>
  >
  unregister?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
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
  storeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
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
  bucket?: Resolver<
    Maybe<ResolversTypes['Bucket']>,
    ParentType,
    ContextType,
    RequireFields<QueryBucketArgs, 'id'>
  >
  buckets?: Resolver<
    Maybe<Array<ResolversTypes['Bucket']>>,
    ParentType,
    ContextType,
    RequireFields<QueryBucketsArgs, 'type'>
  >
  feed?: Resolver<
    Maybe<ResolversTypes['Feed']>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedArgs, 'id'>
  >
  feedListByStore?: Resolver<
    Maybe<Array<ResolversTypes['Feed']>>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedListByStoreArgs, 'storeId'>
  >
  feedListByTown?: Resolver<
    Maybe<Array<ResolversTypes['Feed']>>,
    ParentType,
    ContextType,
    RequireFields<QueryFeedListByTownArgs, never>
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
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  menu?: Resolver<
    Maybe<ResolversTypes['Menu']>,
    ParentType,
    ContextType,
    RequireFields<QueryMenuArgs, 'id'>
  >
  menuByName?: Resolver<
    Maybe<ResolversTypes['Menu']>,
    ParentType,
    ContextType,
    RequireFields<QueryMenuByNameArgs, 'storeId' | 'name'>
  >
  menusByStore?: Resolver<
    Maybe<Array<ResolversTypes['Menu']>>,
    ParentType,
    ContextType,
    RequireFields<QueryMenusByStoreArgs, 'storeId'>
  >
  menusByTownAndCategory?: Resolver<
    Maybe<Array<ResolversTypes['Menu']>>,
    ParentType,
    ContextType,
    RequireFields<QueryMenusByTownAndCategoryArgs, never>
  >
  menusInBucket?: Resolver<
    Maybe<Array<ResolversTypes['Menu']>>,
    ParentType,
    ContextType,
    RequireFields<QueryMenusInBucketArgs, 'bucketId' | 'userUniqueName'>
  >
  news?: Resolver<
    Maybe<ResolversTypes['News']>,
    ParentType,
    ContextType,
    RequireFields<QueryNewsArgs, 'id'>
  >
  newsListByStore?: Resolver<
    Maybe<Array<ResolversTypes['News']>>,
    ParentType,
    ContextType,
    RequireFields<QueryNewsListByStoreArgs, 'storeId'>
  >
  newsListByTown?: Resolver<
    Maybe<Array<ResolversTypes['News']>>,
    ParentType,
    ContextType,
    RequireFields<QueryNewsListByTownArgs, never>
  >
  searchFeed?: Resolver<
    Maybe<Array<ResolversTypes['Menu']>>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchFeedArgs, 'hashtags'>
  >
  searchMenus?: Resolver<
    Maybe<Array<ResolversTypes['Menu']>>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchMenusArgs, 'hashtags'>
  >
  searchStores?: Resolver<
    Maybe<Array<ResolversTypes['Menu']>>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchStoresArgs, 'hashtags'>
  >
  store?: Resolver<
    Maybe<ResolversTypes['Store']>,
    ParentType,
    ContextType,
    RequireFields<QueryStoreArgs, 'id'>
  >
  storesByTownAndCategory?: Resolver<
    Maybe<Array<ResolversTypes['Store']>>,
    ParentType,
    ContextType,
    RequireFields<QueryStoresByTownAndCategoryArgs, never>
  >
  storesInBucket?: Resolver<
    Maybe<Array<ResolversTypes['Store']>>,
    ParentType,
    ContextType,
    RequireFields<QueryStoresInBucketArgs, 'bucketId' | 'userUniqueName'>
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
  news?: Resolver<Maybe<Array<ResolversTypes['News']>>, ParentType, ContextType>
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
  nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>
  feed?: Resolver<Maybe<Array<ResolversTypes['Feed']>>, ParentType, ContextType>
  stores?: Resolver<Maybe<Array<ResolversTypes['Store']>>, ParentType, ContextType>
  followings?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>
  followers?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>
  likedComments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>
  likedFeed?: Resolver<Maybe<Array<ResolversTypes['Feed']>>, ParentType, ContextType>
  likedMenus?: Resolver<Maybe<Array<ResolversTypes['Menu']>>, ParentType, ContextType>
  likedNews?: Resolver<Maybe<Array<ResolversTypes['News']>>, ParentType, ContextType>
  likedStores?: Resolver<Maybe<Array<ResolversTypes['Store']>>, ParentType, ContextType>
  likedTrends?: Resolver<Maybe<Array<ResolversTypes['Trend']>>, ParentType, ContextType>
  menuBuckets?: Resolver<Maybe<Array<ResolversTypes['Bucket']>>, ParentType, ContextType>
  storeBuckets?: Resolver<Maybe<Array<ResolversTypes['Bucket']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type UserAuthenticationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UserAuthentication'] = ResolversParentTypes['UserAuthentication']
> = {
  userUniqueName?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  jwt?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>
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
  UserAuthentication?: UserAuthenticationResolvers<ContextType>
}
