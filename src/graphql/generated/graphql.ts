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
  DateTime: any
  EmailAddress: any
  JWT: any
  NonEmptyString: any
  URL: any
}

export type Menu = {
  __typename?: 'Menu'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  name: Scalars['String']
  price: Scalars['Int']
  deliciousReviewCount: Scalars['Int']
  deliciousReviewRatio: Scalars['Int']
  fineReviewCount: Scalars['Int']
  fineReviewRatio: Scalars['Int']
  positiveReviewCount: Scalars['Int']
  positiveReviewRatio: Scalars['Int']
  badReviewCount: Scalars['Int']
  badReviewRatio: Scalars['Int']
  totalReviewCount: Scalars['Int']
  newOrderCount: Scalars['Int']
  newOrderRatio: Scalars['Int']
  reorderCount: Scalars['Int']
  reorderRatio: Scalars['Int']
  totalOrderCount: Scalars['Int']
  newCustomerCount: Scalars['Int']
  newCustomerRatio: Scalars['Int']
  regularCustomerCount: Scalars['Int']
  regularCustomerRatio: Scalars['Int']
  totalCustomerCount: Scalars['Int']
  favoriteCount: Scalars['Int']
  clickCount: Scalars['Int']
  storePostCount: Scalars['Int']
  isDiscounted: Scalars['Boolean']
  canBePicked: Scalars['Boolean']
  canBeReserved: Scalars['Boolean']
  categoryId: Scalars['ID']
  storeId: Scalars['ID']
  content?: Maybe<Scalars['String']>
  imageUrls?: Maybe<Array<Scalars['URL']>>
  themeId?: Maybe<Scalars['ID']>
  /** 해당 메뉴의 카테고리를 반환한다. */
  category: Scalars['String']
  /** 로그인 상태일 때 요청하면 사용자가 해당 메뉴를 찜한 여부를 반환한다. */
  favorite: Scalars['Boolean']
  /** 해당 메뉴가 속한 매장 정보를 반환한다. */
  store: Store
  /** 해당 메뉴가 가진 해시태그 목록을 반환한다. */
  hashtags?: Maybe<Array<Scalars['NonEmptyString']>>
  /** 해당 메뉴가 속한 테마를 반환한다. */
  theme?: Maybe<Scalars['String']>
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
  /** 사용자 선호 해시태그를 입력값 그대로 설정한다. */
  updatePreferences: Array<Scalars['NonEmptyString']>
}

export type MutationRegisterArgs = {
  input: RegisterInput
}

export type MutationLoginArgs = {
  email: Scalars['EmailAddress']
  passwordHash: Scalars['String']
}

export type MutationUpdatePreferencesArgs = {
  preferences: Array<Scalars['NonEmptyString']>
}

/** OAuth 공급자 */
export enum Provider {
  DessertFit = 'DESSERT_FIT',
  Google = 'GOOGLE',
  Naver = 'NAVER',
  Kakao = 'KAKAO',
}

export type Query = {
  __typename?: 'Query'
  /** 인증 토큰과 같이 요청하면 사용자 정보를 반환한다. */
  me: User
  /**
   * 이메일 중복 여부를 검사한다.
   *
   * `True`: 중복되지 않은 이메일
   *
   * `False`: 중복된 이메일
   */
  verifyUniqueEmail: Scalars['Boolean']
}

export type QueryVerifyUniqueEmailArgs = {
  email: Scalars['EmailAddress']
}

export type RegisterInput = {
  email: Scalars['EmailAddress']
  passwordHash: Scalars['String']
  name?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  gender?: Maybe<Scalars['String']>
  birthDate?: Maybe<Scalars['DateTime']>
  imageUrl?: Maybe<Scalars['URL']>
  deliveryAddress?: Maybe<Scalars['String']>
  preference?: Maybe<Array<Scalars['NonEmptyString']>>
}

export type Store = {
  __typename?: 'Store'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  name: Scalars['String']
  address: Scalars['String']
  businessRegistrationName: Scalars['String']
  businessRegistrationNumber: Scalars['String']
  businessRegistrationAddress: Scalars['String']
  businessRepresentativeName: Scalars['String']
  isFranchise: Scalars['Boolean']
  deliveryCharge: Scalars['Int']
  minimumDeliveryAmount: Scalars['Int']
  deliciousReviewCount: Scalars['Int']
  deliciousReviewRatio: Scalars['Int']
  fineReviewCount: Scalars['Int']
  fineReviewRatio: Scalars['Int']
  positiveReviewCount: Scalars['Int']
  positiveReviewRatio: Scalars['Int']
  badReviewCount: Scalars['Int']
  badReviewRatio: Scalars['Int']
  totalReviewCount: Scalars['Int']
  newOrderCount: Scalars['Int']
  newOrderRatio: Scalars['Int']
  reorderCount: Scalars['Int']
  reorderRatio: Scalars['Int']
  totalOrderCount: Scalars['Int']
  newCustomerCount: Scalars['Int']
  newCustomerRatio: Scalars['Int']
  regularCustomerCount: Scalars['Int']
  regularCustomerRatio: Scalars['Int']
  totalCustomerCount: Scalars['Int']
  favoriteCount: Scalars['Int']
  clickCount: Scalars['Int']
  postCount: Scalars['Int']
  userId: Scalars['ID']
  reviewEventContent?: Maybe<Scalars['String']>
  regularCustomerEventContent?: Maybe<Scalars['String']>
  minimumDeliveryTime?: Maybe<Scalars['Int']>
  maximumDeliveryTime?: Maybe<Scalars['Int']>
  imageUrls?: Maybe<Array<Scalars['URL']>>
  /** 로그인 상태일 때 요청하면 사용자가 해당 매장을 찜한 여부를 반환한다. */
  favorite: Scalars['Boolean']
  /** 해당 매장에서 판매 중인 메뉴 목록을 반환한다. */
  menus: Array<Menu>
  /** 로그인 상태일 때 요청하면 사용자가 해당 매장의 단골인지를 반환한다. */
  regular: Scalars['Boolean']
  /** 해당 매장을 소유한 사용자 정보를 반환한다. */
  user: User
  hashtags?: Maybe<Array<Scalars['NonEmptyString']>>
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  creationTime: Scalars['DateTime']
  modificationTime: Scalars['DateTime']
  email: Scalars['EmailAddress']
  providers: Array<Provider>
  point: Scalars['Int']
  isEmailVerified: Scalars['Boolean']
  name?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  gender?: Maybe<Scalars['String']>
  birthDate?: Maybe<Scalars['DateTime']>
  imageUrls?: Maybe<Array<Scalars['URL']>>
  deliveryAddresses?: Maybe<Scalars['String']>
  representativeDeliveryAddress?: Maybe<Scalars['String']>
  favoriteMenus?: Maybe<Array<Menu>>
  favoriteStores?: Maybe<Array<Store>>
  preferences?: Maybe<Array<Scalars['NonEmptyString']>>
  regularStores?: Maybe<Array<Store>>
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

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
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>
  JWT: ResolverTypeWrapper<Scalars['JWT']>
  Menu: ResolverTypeWrapper<Menu>
  ID: ResolverTypeWrapper<Scalars['ID']>
  String: ResolverTypeWrapper<Scalars['String']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Mutation: ResolverTypeWrapper<{}>
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>
  Provider: Provider
  Query: ResolverTypeWrapper<{}>
  RegisterInput: RegisterInput
  Store: ResolverTypeWrapper<Store>
  URL: ResolverTypeWrapper<Scalars['URL']>
  User: ResolverTypeWrapper<User>
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars['DateTime']
  EmailAddress: Scalars['EmailAddress']
  JWT: Scalars['JWT']
  Menu: Menu
  ID: Scalars['ID']
  String: Scalars['String']
  Int: Scalars['Int']
  Boolean: Scalars['Boolean']
  Mutation: {}
  NonEmptyString: Scalars['NonEmptyString']
  Query: {}
  RegisterInput: RegisterInput
  Store: Store
  URL: Scalars['URL']
  User: User
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress'
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
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  deliciousReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  deliciousReviewRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  fineReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  fineReviewRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  positiveReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  positiveReviewRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  badReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  badReviewRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  newOrderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  newOrderRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  reorderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  reorderRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalOrderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  newCustomerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  newCustomerRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  regularCustomerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  regularCustomerRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalCustomerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  favoriteCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  clickCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  storePostCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  isDiscounted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  canBePicked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  canBeReserved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  categoryId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  storeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<ResolversTypes['URL']>>, ParentType, ContextType>
  themeId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  favorite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType>
  hashtags?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
  theme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
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
  updatePreferences?: Resolver<
    Array<ResolversTypes['NonEmptyString']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePreferencesArgs, 'preferences'>
  >
}

export interface NonEmptyStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['NonEmptyString'], any> {
  name: 'NonEmptyString'
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  verifyUniqueEmail?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryVerifyUniqueEmailArgs, 'email'>
  >
}

export type StoreResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']
> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  modificationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  businessRegistrationName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  businessRegistrationNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  businessRegistrationAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  businessRepresentativeName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isFranchise?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  deliveryCharge?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  minimumDeliveryAmount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  deliciousReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  deliciousReviewRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  fineReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  fineReviewRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  positiveReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  positiveReviewRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  badReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  badReviewRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalReviewCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  newOrderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  newOrderRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  reorderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  reorderRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalOrderCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  newCustomerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  newCustomerRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  regularCustomerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  regularCustomerRatio?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  totalCustomerCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  favoriteCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  clickCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  postCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  reviewEventContent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  regularCustomerEventContent?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  minimumDeliveryTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  maximumDeliveryTime?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<ResolversTypes['URL']>>, ParentType, ContextType>
  favorite?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  menus?: Resolver<Array<ResolversTypes['Menu']>, ParentType, ContextType>
  regular?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
  hashtags?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
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
  email?: Resolver<ResolversTypes['EmailAddress'], ParentType, ContextType>
  providers?: Resolver<Array<ResolversTypes['Provider']>, ParentType, ContextType>
  point?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  isEmailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  birthDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<ResolversTypes['URL']>>, ParentType, ContextType>
  deliveryAddresses?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  representativeDeliveryAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  favoriteMenus?: Resolver<Maybe<Array<ResolversTypes['Menu']>>, ParentType, ContextType>
  favoriteStores?: Resolver<Maybe<Array<ResolversTypes['Store']>>, ParentType, ContextType>
  preferences?: Resolver<Maybe<Array<ResolversTypes['NonEmptyString']>>, ParentType, ContextType>
  regularStores?: Resolver<Maybe<Array<ResolversTypes['Store']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  DateTime?: GraphQLScalarType
  EmailAddress?: GraphQLScalarType
  JWT?: GraphQLScalarType
  Menu?: MenuResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  NonEmptyString?: GraphQLScalarType
  Query?: QueryResolvers<ContextType>
  Store?: StoreResolvers<ContextType>
  URL?: GraphQLScalarType
  User?: UserResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
