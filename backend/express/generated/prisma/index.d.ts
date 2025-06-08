
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model Event
 * 
 */
export type Event = $Result.DefaultSelection<Prisma.$EventPayload>
/**
 * Model Bilan
 * 
 */
export type Bilan = $Result.DefaultSelection<Prisma.$BilanPayload>
/**
 * Model BilanEntry
 * 
 */
export type BilanEntry = $Result.DefaultSelection<Prisma.$BilanEntryPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const NotificationType: {
  task_due_in_1day: 'task_due_in_1day',
  event_in_1day: 'event_in_1day',
  task_due_in_6h: 'task_due_in_6h',
  event_in_6h: 'event_in_6h',
  task_due_in_1h: 'task_due_in_1h',
  event_in_1h: 'event_in_1h',
  task_due_in_15m: 'task_due_in_15m',
  event_in_15m: 'event_in_15m'
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

}

export type NotificationType = $Enums.NotificationType

export const NotificationType: typeof $Enums.NotificationType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bilan`: Exposes CRUD operations for the **Bilan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bilans
    * const bilans = await prisma.bilan.findMany()
    * ```
    */
  get bilan(): Prisma.BilanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bilanEntry`: Exposes CRUD operations for the **BilanEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BilanEntries
    * const bilanEntries = await prisma.bilanEntry.findMany()
    * ```
    */
  get bilanEntry(): Prisma.BilanEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Task: 'Task',
    Event: 'Event',
    Bilan: 'Bilan',
    BilanEntry: 'BilanEntry',
    Notification: 'Notification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "task" | "event" | "bilan" | "bilanEntry" | "notification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaskCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaskUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      Event: {
        payload: Prisma.$EventPayload<ExtArgs>
        fields: Prisma.EventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findFirst: {
            args: Prisma.EventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          findMany: {
            args: Prisma.EventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          create: {
            args: Prisma.EventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          createMany: {
            args: Prisma.EventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          delete: {
            args: Prisma.EventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          update: {
            args: Prisma.EventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          deleteMany: {
            args: Prisma.EventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>[]
          }
          upsert: {
            args: Prisma.EventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventPayload>
          }
          aggregate: {
            args: Prisma.EventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEvent>
          }
          groupBy: {
            args: Prisma.EventGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventCountArgs<ExtArgs>
            result: $Utils.Optional<EventCountAggregateOutputType> | number
          }
        }
      }
      Bilan: {
        payload: Prisma.$BilanPayload<ExtArgs>
        fields: Prisma.BilanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BilanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BilanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>
          }
          findFirst: {
            args: Prisma.BilanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BilanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>
          }
          findMany: {
            args: Prisma.BilanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>[]
          }
          create: {
            args: Prisma.BilanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>
          }
          createMany: {
            args: Prisma.BilanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BilanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>[]
          }
          delete: {
            args: Prisma.BilanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>
          }
          update: {
            args: Prisma.BilanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>
          }
          deleteMany: {
            args: Prisma.BilanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BilanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BilanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>[]
          }
          upsert: {
            args: Prisma.BilanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanPayload>
          }
          aggregate: {
            args: Prisma.BilanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBilan>
          }
          groupBy: {
            args: Prisma.BilanGroupByArgs<ExtArgs>
            result: $Utils.Optional<BilanGroupByOutputType>[]
          }
          count: {
            args: Prisma.BilanCountArgs<ExtArgs>
            result: $Utils.Optional<BilanCountAggregateOutputType> | number
          }
        }
      }
      BilanEntry: {
        payload: Prisma.$BilanEntryPayload<ExtArgs>
        fields: Prisma.BilanEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BilanEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BilanEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>
          }
          findFirst: {
            args: Prisma.BilanEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BilanEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>
          }
          findMany: {
            args: Prisma.BilanEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>[]
          }
          create: {
            args: Prisma.BilanEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>
          }
          createMany: {
            args: Prisma.BilanEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BilanEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>[]
          }
          delete: {
            args: Prisma.BilanEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>
          }
          update: {
            args: Prisma.BilanEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>
          }
          deleteMany: {
            args: Prisma.BilanEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BilanEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BilanEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>[]
          }
          upsert: {
            args: Prisma.BilanEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BilanEntryPayload>
          }
          aggregate: {
            args: Prisma.BilanEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBilanEntry>
          }
          groupBy: {
            args: Prisma.BilanEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<BilanEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.BilanEntryCountArgs<ExtArgs>
            result: $Utils.Optional<BilanEntryCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    task?: TaskOmit
    event?: EventOmit
    bilan?: BilanOmit
    bilanEntry?: BilanEntryOmit
    notification?: NotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    tasks: number
    events: number
    bilans: number
    notifications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | UserCountOutputTypeCountTasksArgs
    events?: boolean | UserCountOutputTypeCountEventsArgs
    bilans?: boolean | UserCountOutputTypeCountBilansArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBilansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BilanWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type TaskCountOutputType
   */

  export type TaskCountOutputType = {
    bilanEntries: number
    Notification: number
  }

  export type TaskCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bilanEntries?: boolean | TaskCountOutputTypeCountBilanEntriesArgs
    Notification?: boolean | TaskCountOutputTypeCountNotificationArgs
  }

  // Custom InputTypes
  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaskCountOutputType
     */
    select?: TaskCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountBilanEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BilanEntryWhereInput
  }

  /**
   * TaskCountOutputType without action
   */
  export type TaskCountOutputTypeCountNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type EventCountOutputType
   */

  export type EventCountOutputType = {
    Notification: number
  }

  export type EventCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Notification?: boolean | EventCountOutputTypeCountNotificationArgs
  }

  // Custom InputTypes
  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeCountNotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type BilanCountOutputType
   */

  export type BilanCountOutputType = {
    entries: number
  }

  export type BilanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    entries?: boolean | BilanCountOutputTypeCountEntriesArgs
  }

  // Custom InputTypes
  /**
   * BilanCountOutputType without action
   */
  export type BilanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanCountOutputType
     */
    select?: BilanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BilanCountOutputType without action
   */
  export type BilanCountOutputTypeCountEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BilanEntryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    full_name: string | null
    avatar_url: string | null
    theme: string | null
    colorTheme: string | null
    created_at: Date | null
    updated_at: Date | null
    receive_task_notifications: boolean | null
    receive_event_notifications: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    full_name: string | null
    avatar_url: string | null
    theme: string | null
    colorTheme: string | null
    created_at: Date | null
    updated_at: Date | null
    receive_task_notifications: boolean | null
    receive_event_notifications: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    full_name: number
    avatar_url: number
    theme: number
    colorTheme: number
    created_at: number
    updated_at: number
    receive_task_notifications: number
    receive_event_notifications: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    theme?: true
    colorTheme?: true
    created_at?: true
    updated_at?: true
    receive_task_notifications?: true
    receive_event_notifications?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    theme?: true
    colorTheme?: true
    created_at?: true
    updated_at?: true
    receive_task_notifications?: true
    receive_event_notifications?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    full_name?: true
    avatar_url?: true
    theme?: true
    colorTheme?: true
    created_at?: true
    updated_at?: true
    receive_task_notifications?: true
    receive_event_notifications?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    theme: string | null
    colorTheme: string | null
    created_at: Date
    updated_at: Date
    receive_task_notifications: boolean
    receive_event_notifications: boolean
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    theme?: boolean
    colorTheme?: boolean
    created_at?: boolean
    updated_at?: boolean
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: boolean | User$tasksArgs<ExtArgs>
    events?: boolean | User$eventsArgs<ExtArgs>
    bilans?: boolean | User$bilansArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    theme?: boolean
    colorTheme?: boolean
    created_at?: boolean
    updated_at?: boolean
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    theme?: boolean
    colorTheme?: boolean
    created_at?: boolean
    updated_at?: boolean
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    full_name?: boolean
    avatar_url?: boolean
    theme?: boolean
    colorTheme?: boolean
    created_at?: boolean
    updated_at?: boolean
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "full_name" | "avatar_url" | "theme" | "colorTheme" | "created_at" | "updated_at" | "receive_task_notifications" | "receive_event_notifications", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | User$tasksArgs<ExtArgs>
    events?: boolean | User$eventsArgs<ExtArgs>
    bilans?: boolean | User$bilansArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tasks: Prisma.$TaskPayload<ExtArgs>[]
      events: Prisma.$EventPayload<ExtArgs>[]
      bilans: Prisma.$BilanPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      full_name: string | null
      avatar_url: string | null
      theme: string | null
      colorTheme: string | null
      created_at: Date
      updated_at: Date
      receive_task_notifications: boolean
      receive_event_notifications: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tasks<T extends User$tasksArgs<ExtArgs> = {}>(args?: Subset<T, User$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends User$eventsArgs<ExtArgs> = {}>(args?: Subset<T, User$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bilans<T extends User$bilansArgs<ExtArgs> = {}>(args?: Subset<T, User$bilansArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly full_name: FieldRef<"User", 'String'>
    readonly avatar_url: FieldRef<"User", 'String'>
    readonly theme: FieldRef<"User", 'String'>
    readonly colorTheme: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
    readonly receive_task_notifications: FieldRef<"User", 'Boolean'>
    readonly receive_event_notifications: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.tasks
   */
  export type User$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * User.events
   */
  export type User$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    cursor?: EventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * User.bilans
   */
  export type User$bilansArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    where?: BilanWhereInput
    orderBy?: BilanOrderByWithRelationInput | BilanOrderByWithRelationInput[]
    cursor?: BilanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BilanScalarFieldEnum | BilanScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    title: string | null
    deadline: Date | null
    deadline_text: string | null
    priority: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
    user_id: string | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    title: string | null
    deadline: Date | null
    deadline_text: string | null
    priority: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
    user_id: string | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    title: number
    deadline: number
    deadline_text: number
    priority: number
    status: number
    created_at: number
    updated_at: number
    user_id: number
    _all: number
  }


  export type TaskMinAggregateInputType = {
    id?: true
    title?: true
    deadline?: true
    deadline_text?: true
    priority?: true
    status?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    title?: true
    deadline?: true
    deadline_text?: true
    priority?: true
    status?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    title?: true
    deadline?: true
    deadline_text?: true
    priority?: true
    status?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    title: string
    deadline: Date | null
    deadline_text: string | null
    priority: string | null
    status: string | null
    created_at: Date
    updated_at: Date
    user_id: string
    _count: TaskCountAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    deadline?: boolean
    deadline_text?: boolean
    priority?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    bilanEntries?: boolean | Task$bilanEntriesArgs<ExtArgs>
    Notification?: boolean | Task$NotificationArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    deadline?: boolean
    deadline_text?: boolean
    priority?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    deadline?: boolean
    deadline_text?: boolean
    priority?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>

  export type TaskSelectScalar = {
    id?: boolean
    title?: boolean
    deadline?: boolean
    deadline_text?: boolean
    priority?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
  }

  export type TaskOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "deadline" | "deadline_text" | "priority" | "status" | "created_at" | "updated_at" | "user_id", ExtArgs["result"]["task"]>
  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    bilanEntries?: boolean | Task$bilanEntriesArgs<ExtArgs>
    Notification?: boolean | Task$NotificationArgs<ExtArgs>
    _count?: boolean | TaskCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TaskIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TaskIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      bilanEntries: Prisma.$BilanEntryPayload<ExtArgs>[]
      Notification: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      deadline: Date | null
      deadline_text: string | null
      priority: string | null
      status: string | null
      created_at: Date
      updated_at: Date
      user_id: string
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tasks and returns the data saved in the database.
     * @param {TaskCreateManyAndReturnArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaskCreateManyAndReturnArgs>(args?: SelectSubset<T, TaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks and returns the data updated in the database.
     * @param {TaskUpdateManyAndReturnArgs} args - Arguments to update many Tasks.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tasks and only return the `id`
     * const taskWithIdOnly = await prisma.task.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaskUpdateManyAndReturnArgs>(args: SelectSubset<T, TaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bilanEntries<T extends Task$bilanEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Task$bilanEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Notification<T extends Task$NotificationArgs<ExtArgs> = {}>(args?: Subset<T, Task$NotificationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly deadline: FieldRef<"Task", 'DateTime'>
    readonly deadline_text: FieldRef<"Task", 'String'>
    readonly priority: FieldRef<"Task", 'String'>
    readonly status: FieldRef<"Task", 'String'>
    readonly created_at: FieldRef<"Task", 'DateTime'>
    readonly updated_at: FieldRef<"Task", 'DateTime'>
    readonly user_id: FieldRef<"Task", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Task createManyAndReturn
   */
  export type TaskCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
  }

  /**
   * Task updateManyAndReturn
   */
  export type TaskUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
    /**
     * Limit how many Tasks to delete.
     */
    limit?: number
  }

  /**
   * Task.bilanEntries
   */
  export type Task$bilanEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    where?: BilanEntryWhereInput
    orderBy?: BilanEntryOrderByWithRelationInput | BilanEntryOrderByWithRelationInput[]
    cursor?: BilanEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BilanEntryScalarFieldEnum | BilanEntryScalarFieldEnum[]
  }

  /**
   * Task.Notification
   */
  export type Task$NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model Event
   */

  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventMinAggregateOutputType = {
    id: string | null
    title: string | null
    date_time: Date | null
    date_time_text: string | null
    created_at: Date | null
    updated_at: Date | null
    user_id: string | null
  }

  export type EventMaxAggregateOutputType = {
    id: string | null
    title: string | null
    date_time: Date | null
    date_time_text: string | null
    created_at: Date | null
    updated_at: Date | null
    user_id: string | null
  }

  export type EventCountAggregateOutputType = {
    id: number
    title: number
    date_time: number
    date_time_text: number
    created_at: number
    updated_at: number
    user_id: number
    _all: number
  }


  export type EventMinAggregateInputType = {
    id?: true
    title?: true
    date_time?: true
    date_time_text?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type EventMaxAggregateInputType = {
    id?: true
    title?: true
    date_time?: true
    date_time_text?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type EventCountAggregateInputType = {
    id?: true
    title?: true
    date_time?: true
    date_time_text?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    _all?: true
  }

  export type EventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventWhereInput
    orderBy?: EventOrderByWithAggregationInput | EventOrderByWithAggregationInput[]
    by: EventScalarFieldEnum[] | EventScalarFieldEnum
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }

  export type EventGroupByOutputType = {
    id: string
    title: string
    date_time: Date | null
    date_time_text: string | null
    created_at: Date
    updated_at: Date
    user_id: string
    _count: EventCountAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date_time?: boolean
    date_time_text?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    Notification?: boolean | Event$NotificationArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date_time?: boolean
    date_time_text?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    date_time?: boolean
    date_time_text?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["event"]>

  export type EventSelectScalar = {
    id?: boolean
    title?: boolean
    date_time?: boolean
    date_time_text?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
  }

  export type EventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "date_time" | "date_time_text" | "created_at" | "updated_at" | "user_id", ExtArgs["result"]["event"]>
  export type EventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    Notification?: boolean | Event$NotificationArgs<ExtArgs>
    _count?: boolean | EventCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Event"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      Notification: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      date_time: Date | null
      date_time_text: string | null
      created_at: Date
      updated_at: Date
      user_id: string
    }, ExtArgs["result"]["event"]>
    composites: {}
  }

  type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = $Result.GetResult<Prisma.$EventPayload, S>

  type EventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Event'], meta: { name: 'Event' } }
    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventFindUniqueArgs>(args: SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Event that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventFindFirstArgs>(args?: SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Event that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventWithIdOnly = await prisma.event.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventFindManyArgs>(args?: SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
     */
    create<T extends EventCreateArgs>(args: SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Events.
     * @param {EventCreateManyArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventCreateManyArgs>(args?: SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Events and returns the data saved in the database.
     * @param {EventCreateManyAndReturnArgs} args - Arguments to create many Events.
     * @example
     * // Create many Events
     * const event = await prisma.event.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
     */
    delete<T extends EventDeleteArgs>(args: SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventUpdateArgs>(args: SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventDeleteManyArgs>(args?: SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventUpdateManyArgs>(args: SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events and returns the data updated in the database.
     * @param {EventUpdateManyAndReturnArgs} args - Arguments to update many Events.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Events and only return the `id`
     * const eventWithIdOnly = await prisma.event.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
     */
    upsert<T extends EventUpsertArgs>(args: SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Event model
   */
  readonly fields: EventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Notification<T extends Event$NotificationArgs<ExtArgs> = {}>(args?: Subset<T, Event$NotificationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Event model
   */
  interface EventFieldRefs {
    readonly id: FieldRef<"Event", 'String'>
    readonly title: FieldRef<"Event", 'String'>
    readonly date_time: FieldRef<"Event", 'DateTime'>
    readonly date_time_text: FieldRef<"Event", 'String'>
    readonly created_at: FieldRef<"Event", 'DateTime'>
    readonly updated_at: FieldRef<"Event", 'DateTime'>
    readonly user_id: FieldRef<"Event", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Event findUnique
   */
  export type EventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findFirst
   */
  export type EventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event findMany
   */
  export type EventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: EventOrderByWithRelationInput | EventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: EventScalarFieldEnum | EventScalarFieldEnum[]
  }

  /**
   * Event create
   */
  export type EventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }

  /**
   * Event createMany
   */
  export type EventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Event createManyAndReturn
   */
  export type EventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to create many Events.
     */
    data: EventCreateManyInput | EventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event update
   */
  export type EventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
  }

  /**
   * Event updateManyAndReturn
   */
  export type EventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Event upsert
   */
  export type EventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }

  /**
   * Event delete
   */
  export type EventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
    /**
     * Limit how many Events to delete.
     */
    limit?: number
  }

  /**
   * Event.Notification
   */
  export type Event$NotificationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Event without action
   */
  export type EventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
  }


  /**
   * Model Bilan
   */

  export type AggregateBilan = {
    _count: BilanCountAggregateOutputType | null
    _min: BilanMinAggregateOutputType | null
    _max: BilanMaxAggregateOutputType | null
  }

  export type BilanMinAggregateOutputType = {
    id: string | null
    date: Date | null
    created_at: Date | null
    updated_at: Date | null
    user_id: string | null
  }

  export type BilanMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    created_at: Date | null
    updated_at: Date | null
    user_id: string | null
  }

  export type BilanCountAggregateOutputType = {
    id: number
    date: number
    created_at: number
    updated_at: number
    user_id: number
    _all: number
  }


  export type BilanMinAggregateInputType = {
    id?: true
    date?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type BilanMaxAggregateInputType = {
    id?: true
    date?: true
    created_at?: true
    updated_at?: true
    user_id?: true
  }

  export type BilanCountAggregateInputType = {
    id?: true
    date?: true
    created_at?: true
    updated_at?: true
    user_id?: true
    _all?: true
  }

  export type BilanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bilan to aggregate.
     */
    where?: BilanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bilans to fetch.
     */
    orderBy?: BilanOrderByWithRelationInput | BilanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BilanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bilans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bilans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bilans
    **/
    _count?: true | BilanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BilanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BilanMaxAggregateInputType
  }

  export type GetBilanAggregateType<T extends BilanAggregateArgs> = {
        [P in keyof T & keyof AggregateBilan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBilan[P]>
      : GetScalarType<T[P], AggregateBilan[P]>
  }




  export type BilanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BilanWhereInput
    orderBy?: BilanOrderByWithAggregationInput | BilanOrderByWithAggregationInput[]
    by: BilanScalarFieldEnum[] | BilanScalarFieldEnum
    having?: BilanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BilanCountAggregateInputType | true
    _min?: BilanMinAggregateInputType
    _max?: BilanMaxAggregateInputType
  }

  export type BilanGroupByOutputType = {
    id: string
    date: Date
    created_at: Date
    updated_at: Date
    user_id: string
    _count: BilanCountAggregateOutputType | null
    _min: BilanMinAggregateOutputType | null
    _max: BilanMaxAggregateOutputType | null
  }

  type GetBilanGroupByPayload<T extends BilanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BilanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BilanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BilanGroupByOutputType[P]>
            : GetScalarType<T[P], BilanGroupByOutputType[P]>
        }
      >
    >


  export type BilanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    entries?: boolean | Bilan$entriesArgs<ExtArgs>
    _count?: boolean | BilanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bilan"]>

  export type BilanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bilan"]>

  export type BilanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bilan"]>

  export type BilanSelectScalar = {
    id?: boolean
    date?: boolean
    created_at?: boolean
    updated_at?: boolean
    user_id?: boolean
  }

  export type BilanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "created_at" | "updated_at" | "user_id", ExtArgs["result"]["bilan"]>
  export type BilanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    entries?: boolean | Bilan$entriesArgs<ExtArgs>
    _count?: boolean | BilanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BilanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type BilanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $BilanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bilan"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      entries: Prisma.$BilanEntryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      created_at: Date
      updated_at: Date
      user_id: string
    }, ExtArgs["result"]["bilan"]>
    composites: {}
  }

  type BilanGetPayload<S extends boolean | null | undefined | BilanDefaultArgs> = $Result.GetResult<Prisma.$BilanPayload, S>

  type BilanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BilanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BilanCountAggregateInputType | true
    }

  export interface BilanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bilan'], meta: { name: 'Bilan' } }
    /**
     * Find zero or one Bilan that matches the filter.
     * @param {BilanFindUniqueArgs} args - Arguments to find a Bilan
     * @example
     * // Get one Bilan
     * const bilan = await prisma.bilan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BilanFindUniqueArgs>(args: SelectSubset<T, BilanFindUniqueArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bilan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BilanFindUniqueOrThrowArgs} args - Arguments to find a Bilan
     * @example
     * // Get one Bilan
     * const bilan = await prisma.bilan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BilanFindUniqueOrThrowArgs>(args: SelectSubset<T, BilanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bilan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanFindFirstArgs} args - Arguments to find a Bilan
     * @example
     * // Get one Bilan
     * const bilan = await prisma.bilan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BilanFindFirstArgs>(args?: SelectSubset<T, BilanFindFirstArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bilan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanFindFirstOrThrowArgs} args - Arguments to find a Bilan
     * @example
     * // Get one Bilan
     * const bilan = await prisma.bilan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BilanFindFirstOrThrowArgs>(args?: SelectSubset<T, BilanFindFirstOrThrowArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bilans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bilans
     * const bilans = await prisma.bilan.findMany()
     * 
     * // Get first 10 Bilans
     * const bilans = await prisma.bilan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bilanWithIdOnly = await prisma.bilan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BilanFindManyArgs>(args?: SelectSubset<T, BilanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bilan.
     * @param {BilanCreateArgs} args - Arguments to create a Bilan.
     * @example
     * // Create one Bilan
     * const Bilan = await prisma.bilan.create({
     *   data: {
     *     // ... data to create a Bilan
     *   }
     * })
     * 
     */
    create<T extends BilanCreateArgs>(args: SelectSubset<T, BilanCreateArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bilans.
     * @param {BilanCreateManyArgs} args - Arguments to create many Bilans.
     * @example
     * // Create many Bilans
     * const bilan = await prisma.bilan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BilanCreateManyArgs>(args?: SelectSubset<T, BilanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bilans and returns the data saved in the database.
     * @param {BilanCreateManyAndReturnArgs} args - Arguments to create many Bilans.
     * @example
     * // Create many Bilans
     * const bilan = await prisma.bilan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bilans and only return the `id`
     * const bilanWithIdOnly = await prisma.bilan.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BilanCreateManyAndReturnArgs>(args?: SelectSubset<T, BilanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Bilan.
     * @param {BilanDeleteArgs} args - Arguments to delete one Bilan.
     * @example
     * // Delete one Bilan
     * const Bilan = await prisma.bilan.delete({
     *   where: {
     *     // ... filter to delete one Bilan
     *   }
     * })
     * 
     */
    delete<T extends BilanDeleteArgs>(args: SelectSubset<T, BilanDeleteArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bilan.
     * @param {BilanUpdateArgs} args - Arguments to update one Bilan.
     * @example
     * // Update one Bilan
     * const bilan = await prisma.bilan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BilanUpdateArgs>(args: SelectSubset<T, BilanUpdateArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bilans.
     * @param {BilanDeleteManyArgs} args - Arguments to filter Bilans to delete.
     * @example
     * // Delete a few Bilans
     * const { count } = await prisma.bilan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BilanDeleteManyArgs>(args?: SelectSubset<T, BilanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bilans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bilans
     * const bilan = await prisma.bilan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BilanUpdateManyArgs>(args: SelectSubset<T, BilanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bilans and returns the data updated in the database.
     * @param {BilanUpdateManyAndReturnArgs} args - Arguments to update many Bilans.
     * @example
     * // Update many Bilans
     * const bilan = await prisma.bilan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bilans and only return the `id`
     * const bilanWithIdOnly = await prisma.bilan.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BilanUpdateManyAndReturnArgs>(args: SelectSubset<T, BilanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Bilan.
     * @param {BilanUpsertArgs} args - Arguments to update or create a Bilan.
     * @example
     * // Update or create a Bilan
     * const bilan = await prisma.bilan.upsert({
     *   create: {
     *     // ... data to create a Bilan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bilan we want to update
     *   }
     * })
     */
    upsert<T extends BilanUpsertArgs>(args: SelectSubset<T, BilanUpsertArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bilans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanCountArgs} args - Arguments to filter Bilans to count.
     * @example
     * // Count the number of Bilans
     * const count = await prisma.bilan.count({
     *   where: {
     *     // ... the filter for the Bilans we want to count
     *   }
     * })
    **/
    count<T extends BilanCountArgs>(
      args?: Subset<T, BilanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BilanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bilan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BilanAggregateArgs>(args: Subset<T, BilanAggregateArgs>): Prisma.PrismaPromise<GetBilanAggregateType<T>>

    /**
     * Group by Bilan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BilanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BilanGroupByArgs['orderBy'] }
        : { orderBy?: BilanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BilanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBilanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bilan model
   */
  readonly fields: BilanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bilan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BilanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    entries<T extends Bilan$entriesArgs<ExtArgs> = {}>(args?: Subset<T, Bilan$entriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bilan model
   */
  interface BilanFieldRefs {
    readonly id: FieldRef<"Bilan", 'String'>
    readonly date: FieldRef<"Bilan", 'DateTime'>
    readonly created_at: FieldRef<"Bilan", 'DateTime'>
    readonly updated_at: FieldRef<"Bilan", 'DateTime'>
    readonly user_id: FieldRef<"Bilan", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Bilan findUnique
   */
  export type BilanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * Filter, which Bilan to fetch.
     */
    where: BilanWhereUniqueInput
  }

  /**
   * Bilan findUniqueOrThrow
   */
  export type BilanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * Filter, which Bilan to fetch.
     */
    where: BilanWhereUniqueInput
  }

  /**
   * Bilan findFirst
   */
  export type BilanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * Filter, which Bilan to fetch.
     */
    where?: BilanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bilans to fetch.
     */
    orderBy?: BilanOrderByWithRelationInput | BilanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bilans.
     */
    cursor?: BilanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bilans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bilans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bilans.
     */
    distinct?: BilanScalarFieldEnum | BilanScalarFieldEnum[]
  }

  /**
   * Bilan findFirstOrThrow
   */
  export type BilanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * Filter, which Bilan to fetch.
     */
    where?: BilanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bilans to fetch.
     */
    orderBy?: BilanOrderByWithRelationInput | BilanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bilans.
     */
    cursor?: BilanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bilans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bilans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bilans.
     */
    distinct?: BilanScalarFieldEnum | BilanScalarFieldEnum[]
  }

  /**
   * Bilan findMany
   */
  export type BilanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * Filter, which Bilans to fetch.
     */
    where?: BilanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bilans to fetch.
     */
    orderBy?: BilanOrderByWithRelationInput | BilanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bilans.
     */
    cursor?: BilanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bilans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bilans.
     */
    skip?: number
    distinct?: BilanScalarFieldEnum | BilanScalarFieldEnum[]
  }

  /**
   * Bilan create
   */
  export type BilanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * The data needed to create a Bilan.
     */
    data: XOR<BilanCreateInput, BilanUncheckedCreateInput>
  }

  /**
   * Bilan createMany
   */
  export type BilanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bilans.
     */
    data: BilanCreateManyInput | BilanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bilan createManyAndReturn
   */
  export type BilanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * The data used to create many Bilans.
     */
    data: BilanCreateManyInput | BilanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bilan update
   */
  export type BilanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * The data needed to update a Bilan.
     */
    data: XOR<BilanUpdateInput, BilanUncheckedUpdateInput>
    /**
     * Choose, which Bilan to update.
     */
    where: BilanWhereUniqueInput
  }

  /**
   * Bilan updateMany
   */
  export type BilanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bilans.
     */
    data: XOR<BilanUpdateManyMutationInput, BilanUncheckedUpdateManyInput>
    /**
     * Filter which Bilans to update
     */
    where?: BilanWhereInput
    /**
     * Limit how many Bilans to update.
     */
    limit?: number
  }

  /**
   * Bilan updateManyAndReturn
   */
  export type BilanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * The data used to update Bilans.
     */
    data: XOR<BilanUpdateManyMutationInput, BilanUncheckedUpdateManyInput>
    /**
     * Filter which Bilans to update
     */
    where?: BilanWhereInput
    /**
     * Limit how many Bilans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Bilan upsert
   */
  export type BilanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * The filter to search for the Bilan to update in case it exists.
     */
    where: BilanWhereUniqueInput
    /**
     * In case the Bilan found by the `where` argument doesn't exist, create a new Bilan with this data.
     */
    create: XOR<BilanCreateInput, BilanUncheckedCreateInput>
    /**
     * In case the Bilan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BilanUpdateInput, BilanUncheckedUpdateInput>
  }

  /**
   * Bilan delete
   */
  export type BilanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
    /**
     * Filter which Bilan to delete.
     */
    where: BilanWhereUniqueInput
  }

  /**
   * Bilan deleteMany
   */
  export type BilanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bilans to delete
     */
    where?: BilanWhereInput
    /**
     * Limit how many Bilans to delete.
     */
    limit?: number
  }

  /**
   * Bilan.entries
   */
  export type Bilan$entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    where?: BilanEntryWhereInput
    orderBy?: BilanEntryOrderByWithRelationInput | BilanEntryOrderByWithRelationInput[]
    cursor?: BilanEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BilanEntryScalarFieldEnum | BilanEntryScalarFieldEnum[]
  }

  /**
   * Bilan without action
   */
  export type BilanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bilan
     */
    select?: BilanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bilan
     */
    omit?: BilanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanInclude<ExtArgs> | null
  }


  /**
   * Model BilanEntry
   */

  export type AggregateBilanEntry = {
    _count: BilanEntryCountAggregateOutputType | null
    _avg: BilanEntryAvgAggregateOutputType | null
    _sum: BilanEntrySumAggregateOutputType | null
    _min: BilanEntryMinAggregateOutputType | null
    _max: BilanEntryMaxAggregateOutputType | null
  }

  export type BilanEntryAvgAggregateOutputType = {
    minutes_spent: number | null
  }

  export type BilanEntrySumAggregateOutputType = {
    minutes_spent: number | null
  }

  export type BilanEntryMinAggregateOutputType = {
    id: string | null
    minutes_spent: number | null
    notes: string | null
    created_at: Date | null
    updated_at: Date | null
    bilan_id: string | null
    task_id: string | null
  }

  export type BilanEntryMaxAggregateOutputType = {
    id: string | null
    minutes_spent: number | null
    notes: string | null
    created_at: Date | null
    updated_at: Date | null
    bilan_id: string | null
    task_id: string | null
  }

  export type BilanEntryCountAggregateOutputType = {
    id: number
    minutes_spent: number
    notes: number
    created_at: number
    updated_at: number
    bilan_id: number
    task_id: number
    _all: number
  }


  export type BilanEntryAvgAggregateInputType = {
    minutes_spent?: true
  }

  export type BilanEntrySumAggregateInputType = {
    minutes_spent?: true
  }

  export type BilanEntryMinAggregateInputType = {
    id?: true
    minutes_spent?: true
    notes?: true
    created_at?: true
    updated_at?: true
    bilan_id?: true
    task_id?: true
  }

  export type BilanEntryMaxAggregateInputType = {
    id?: true
    minutes_spent?: true
    notes?: true
    created_at?: true
    updated_at?: true
    bilan_id?: true
    task_id?: true
  }

  export type BilanEntryCountAggregateInputType = {
    id?: true
    minutes_spent?: true
    notes?: true
    created_at?: true
    updated_at?: true
    bilan_id?: true
    task_id?: true
    _all?: true
  }

  export type BilanEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BilanEntry to aggregate.
     */
    where?: BilanEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BilanEntries to fetch.
     */
    orderBy?: BilanEntryOrderByWithRelationInput | BilanEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BilanEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BilanEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BilanEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BilanEntries
    **/
    _count?: true | BilanEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BilanEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BilanEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BilanEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BilanEntryMaxAggregateInputType
  }

  export type GetBilanEntryAggregateType<T extends BilanEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateBilanEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBilanEntry[P]>
      : GetScalarType<T[P], AggregateBilanEntry[P]>
  }




  export type BilanEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BilanEntryWhereInput
    orderBy?: BilanEntryOrderByWithAggregationInput | BilanEntryOrderByWithAggregationInput[]
    by: BilanEntryScalarFieldEnum[] | BilanEntryScalarFieldEnum
    having?: BilanEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BilanEntryCountAggregateInputType | true
    _avg?: BilanEntryAvgAggregateInputType
    _sum?: BilanEntrySumAggregateInputType
    _min?: BilanEntryMinAggregateInputType
    _max?: BilanEntryMaxAggregateInputType
  }

  export type BilanEntryGroupByOutputType = {
    id: string
    minutes_spent: number
    notes: string | null
    created_at: Date
    updated_at: Date
    bilan_id: string
    task_id: string
    _count: BilanEntryCountAggregateOutputType | null
    _avg: BilanEntryAvgAggregateOutputType | null
    _sum: BilanEntrySumAggregateOutputType | null
    _min: BilanEntryMinAggregateOutputType | null
    _max: BilanEntryMaxAggregateOutputType | null
  }

  type GetBilanEntryGroupByPayload<T extends BilanEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BilanEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BilanEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BilanEntryGroupByOutputType[P]>
            : GetScalarType<T[P], BilanEntryGroupByOutputType[P]>
        }
      >
    >


  export type BilanEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    minutes_spent?: boolean
    notes?: boolean
    created_at?: boolean
    updated_at?: boolean
    bilan_id?: boolean
    task_id?: boolean
    bilan?: boolean | BilanDefaultArgs<ExtArgs>
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bilanEntry"]>

  export type BilanEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    minutes_spent?: boolean
    notes?: boolean
    created_at?: boolean
    updated_at?: boolean
    bilan_id?: boolean
    task_id?: boolean
    bilan?: boolean | BilanDefaultArgs<ExtArgs>
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bilanEntry"]>

  export type BilanEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    minutes_spent?: boolean
    notes?: boolean
    created_at?: boolean
    updated_at?: boolean
    bilan_id?: boolean
    task_id?: boolean
    bilan?: boolean | BilanDefaultArgs<ExtArgs>
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bilanEntry"]>

  export type BilanEntrySelectScalar = {
    id?: boolean
    minutes_spent?: boolean
    notes?: boolean
    created_at?: boolean
    updated_at?: boolean
    bilan_id?: boolean
    task_id?: boolean
  }

  export type BilanEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "minutes_spent" | "notes" | "created_at" | "updated_at" | "bilan_id" | "task_id", ExtArgs["result"]["bilanEntry"]>
  export type BilanEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bilan?: boolean | BilanDefaultArgs<ExtArgs>
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }
  export type BilanEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bilan?: boolean | BilanDefaultArgs<ExtArgs>
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }
  export type BilanEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bilan?: boolean | BilanDefaultArgs<ExtArgs>
    task?: boolean | TaskDefaultArgs<ExtArgs>
  }

  export type $BilanEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BilanEntry"
    objects: {
      bilan: Prisma.$BilanPayload<ExtArgs>
      task: Prisma.$TaskPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      minutes_spent: number
      notes: string | null
      created_at: Date
      updated_at: Date
      bilan_id: string
      task_id: string
    }, ExtArgs["result"]["bilanEntry"]>
    composites: {}
  }

  type BilanEntryGetPayload<S extends boolean | null | undefined | BilanEntryDefaultArgs> = $Result.GetResult<Prisma.$BilanEntryPayload, S>

  type BilanEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BilanEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BilanEntryCountAggregateInputType | true
    }

  export interface BilanEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BilanEntry'], meta: { name: 'BilanEntry' } }
    /**
     * Find zero or one BilanEntry that matches the filter.
     * @param {BilanEntryFindUniqueArgs} args - Arguments to find a BilanEntry
     * @example
     * // Get one BilanEntry
     * const bilanEntry = await prisma.bilanEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BilanEntryFindUniqueArgs>(args: SelectSubset<T, BilanEntryFindUniqueArgs<ExtArgs>>): Prisma__BilanEntryClient<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BilanEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BilanEntryFindUniqueOrThrowArgs} args - Arguments to find a BilanEntry
     * @example
     * // Get one BilanEntry
     * const bilanEntry = await prisma.bilanEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BilanEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, BilanEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BilanEntryClient<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BilanEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanEntryFindFirstArgs} args - Arguments to find a BilanEntry
     * @example
     * // Get one BilanEntry
     * const bilanEntry = await prisma.bilanEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BilanEntryFindFirstArgs>(args?: SelectSubset<T, BilanEntryFindFirstArgs<ExtArgs>>): Prisma__BilanEntryClient<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BilanEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanEntryFindFirstOrThrowArgs} args - Arguments to find a BilanEntry
     * @example
     * // Get one BilanEntry
     * const bilanEntry = await prisma.bilanEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BilanEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, BilanEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__BilanEntryClient<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BilanEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BilanEntries
     * const bilanEntries = await prisma.bilanEntry.findMany()
     * 
     * // Get first 10 BilanEntries
     * const bilanEntries = await prisma.bilanEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bilanEntryWithIdOnly = await prisma.bilanEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BilanEntryFindManyArgs>(args?: SelectSubset<T, BilanEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BilanEntry.
     * @param {BilanEntryCreateArgs} args - Arguments to create a BilanEntry.
     * @example
     * // Create one BilanEntry
     * const BilanEntry = await prisma.bilanEntry.create({
     *   data: {
     *     // ... data to create a BilanEntry
     *   }
     * })
     * 
     */
    create<T extends BilanEntryCreateArgs>(args: SelectSubset<T, BilanEntryCreateArgs<ExtArgs>>): Prisma__BilanEntryClient<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BilanEntries.
     * @param {BilanEntryCreateManyArgs} args - Arguments to create many BilanEntries.
     * @example
     * // Create many BilanEntries
     * const bilanEntry = await prisma.bilanEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BilanEntryCreateManyArgs>(args?: SelectSubset<T, BilanEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BilanEntries and returns the data saved in the database.
     * @param {BilanEntryCreateManyAndReturnArgs} args - Arguments to create many BilanEntries.
     * @example
     * // Create many BilanEntries
     * const bilanEntry = await prisma.bilanEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BilanEntries and only return the `id`
     * const bilanEntryWithIdOnly = await prisma.bilanEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BilanEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, BilanEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BilanEntry.
     * @param {BilanEntryDeleteArgs} args - Arguments to delete one BilanEntry.
     * @example
     * // Delete one BilanEntry
     * const BilanEntry = await prisma.bilanEntry.delete({
     *   where: {
     *     // ... filter to delete one BilanEntry
     *   }
     * })
     * 
     */
    delete<T extends BilanEntryDeleteArgs>(args: SelectSubset<T, BilanEntryDeleteArgs<ExtArgs>>): Prisma__BilanEntryClient<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BilanEntry.
     * @param {BilanEntryUpdateArgs} args - Arguments to update one BilanEntry.
     * @example
     * // Update one BilanEntry
     * const bilanEntry = await prisma.bilanEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BilanEntryUpdateArgs>(args: SelectSubset<T, BilanEntryUpdateArgs<ExtArgs>>): Prisma__BilanEntryClient<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BilanEntries.
     * @param {BilanEntryDeleteManyArgs} args - Arguments to filter BilanEntries to delete.
     * @example
     * // Delete a few BilanEntries
     * const { count } = await prisma.bilanEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BilanEntryDeleteManyArgs>(args?: SelectSubset<T, BilanEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BilanEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BilanEntries
     * const bilanEntry = await prisma.bilanEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BilanEntryUpdateManyArgs>(args: SelectSubset<T, BilanEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BilanEntries and returns the data updated in the database.
     * @param {BilanEntryUpdateManyAndReturnArgs} args - Arguments to update many BilanEntries.
     * @example
     * // Update many BilanEntries
     * const bilanEntry = await prisma.bilanEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BilanEntries and only return the `id`
     * const bilanEntryWithIdOnly = await prisma.bilanEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BilanEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, BilanEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BilanEntry.
     * @param {BilanEntryUpsertArgs} args - Arguments to update or create a BilanEntry.
     * @example
     * // Update or create a BilanEntry
     * const bilanEntry = await prisma.bilanEntry.upsert({
     *   create: {
     *     // ... data to create a BilanEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BilanEntry we want to update
     *   }
     * })
     */
    upsert<T extends BilanEntryUpsertArgs>(args: SelectSubset<T, BilanEntryUpsertArgs<ExtArgs>>): Prisma__BilanEntryClient<$Result.GetResult<Prisma.$BilanEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BilanEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanEntryCountArgs} args - Arguments to filter BilanEntries to count.
     * @example
     * // Count the number of BilanEntries
     * const count = await prisma.bilanEntry.count({
     *   where: {
     *     // ... the filter for the BilanEntries we want to count
     *   }
     * })
    **/
    count<T extends BilanEntryCountArgs>(
      args?: Subset<T, BilanEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BilanEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BilanEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BilanEntryAggregateArgs>(args: Subset<T, BilanEntryAggregateArgs>): Prisma.PrismaPromise<GetBilanEntryAggregateType<T>>

    /**
     * Group by BilanEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BilanEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BilanEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BilanEntryGroupByArgs['orderBy'] }
        : { orderBy?: BilanEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BilanEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBilanEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BilanEntry model
   */
  readonly fields: BilanEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BilanEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BilanEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bilan<T extends BilanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BilanDefaultArgs<ExtArgs>>): Prisma__BilanClient<$Result.GetResult<Prisma.$BilanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    task<T extends TaskDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TaskDefaultArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BilanEntry model
   */
  interface BilanEntryFieldRefs {
    readonly id: FieldRef<"BilanEntry", 'String'>
    readonly minutes_spent: FieldRef<"BilanEntry", 'Int'>
    readonly notes: FieldRef<"BilanEntry", 'String'>
    readonly created_at: FieldRef<"BilanEntry", 'DateTime'>
    readonly updated_at: FieldRef<"BilanEntry", 'DateTime'>
    readonly bilan_id: FieldRef<"BilanEntry", 'String'>
    readonly task_id: FieldRef<"BilanEntry", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BilanEntry findUnique
   */
  export type BilanEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * Filter, which BilanEntry to fetch.
     */
    where: BilanEntryWhereUniqueInput
  }

  /**
   * BilanEntry findUniqueOrThrow
   */
  export type BilanEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * Filter, which BilanEntry to fetch.
     */
    where: BilanEntryWhereUniqueInput
  }

  /**
   * BilanEntry findFirst
   */
  export type BilanEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * Filter, which BilanEntry to fetch.
     */
    where?: BilanEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BilanEntries to fetch.
     */
    orderBy?: BilanEntryOrderByWithRelationInput | BilanEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BilanEntries.
     */
    cursor?: BilanEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BilanEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BilanEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BilanEntries.
     */
    distinct?: BilanEntryScalarFieldEnum | BilanEntryScalarFieldEnum[]
  }

  /**
   * BilanEntry findFirstOrThrow
   */
  export type BilanEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * Filter, which BilanEntry to fetch.
     */
    where?: BilanEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BilanEntries to fetch.
     */
    orderBy?: BilanEntryOrderByWithRelationInput | BilanEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BilanEntries.
     */
    cursor?: BilanEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BilanEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BilanEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BilanEntries.
     */
    distinct?: BilanEntryScalarFieldEnum | BilanEntryScalarFieldEnum[]
  }

  /**
   * BilanEntry findMany
   */
  export type BilanEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * Filter, which BilanEntries to fetch.
     */
    where?: BilanEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BilanEntries to fetch.
     */
    orderBy?: BilanEntryOrderByWithRelationInput | BilanEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BilanEntries.
     */
    cursor?: BilanEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BilanEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BilanEntries.
     */
    skip?: number
    distinct?: BilanEntryScalarFieldEnum | BilanEntryScalarFieldEnum[]
  }

  /**
   * BilanEntry create
   */
  export type BilanEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a BilanEntry.
     */
    data: XOR<BilanEntryCreateInput, BilanEntryUncheckedCreateInput>
  }

  /**
   * BilanEntry createMany
   */
  export type BilanEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BilanEntries.
     */
    data: BilanEntryCreateManyInput | BilanEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BilanEntry createManyAndReturn
   */
  export type BilanEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * The data used to create many BilanEntries.
     */
    data: BilanEntryCreateManyInput | BilanEntryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BilanEntry update
   */
  export type BilanEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a BilanEntry.
     */
    data: XOR<BilanEntryUpdateInput, BilanEntryUncheckedUpdateInput>
    /**
     * Choose, which BilanEntry to update.
     */
    where: BilanEntryWhereUniqueInput
  }

  /**
   * BilanEntry updateMany
   */
  export type BilanEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BilanEntries.
     */
    data: XOR<BilanEntryUpdateManyMutationInput, BilanEntryUncheckedUpdateManyInput>
    /**
     * Filter which BilanEntries to update
     */
    where?: BilanEntryWhereInput
    /**
     * Limit how many BilanEntries to update.
     */
    limit?: number
  }

  /**
   * BilanEntry updateManyAndReturn
   */
  export type BilanEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * The data used to update BilanEntries.
     */
    data: XOR<BilanEntryUpdateManyMutationInput, BilanEntryUncheckedUpdateManyInput>
    /**
     * Filter which BilanEntries to update
     */
    where?: BilanEntryWhereInput
    /**
     * Limit how many BilanEntries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BilanEntry upsert
   */
  export type BilanEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the BilanEntry to update in case it exists.
     */
    where: BilanEntryWhereUniqueInput
    /**
     * In case the BilanEntry found by the `where` argument doesn't exist, create a new BilanEntry with this data.
     */
    create: XOR<BilanEntryCreateInput, BilanEntryUncheckedCreateInput>
    /**
     * In case the BilanEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BilanEntryUpdateInput, BilanEntryUncheckedUpdateInput>
  }

  /**
   * BilanEntry delete
   */
  export type BilanEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
    /**
     * Filter which BilanEntry to delete.
     */
    where: BilanEntryWhereUniqueInput
  }

  /**
   * BilanEntry deleteMany
   */
  export type BilanEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BilanEntries to delete
     */
    where?: BilanEntryWhereInput
    /**
     * Limit how many BilanEntries to delete.
     */
    limit?: number
  }

  /**
   * BilanEntry without action
   */
  export type BilanEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BilanEntry
     */
    select?: BilanEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BilanEntry
     */
    omit?: BilanEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BilanEntryInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    title: string | null
    message: string | null
    type: $Enums.NotificationType | null
    read: boolean | null
    created_at: Date | null
    user_id: string | null
    task_id: string | null
    event_id: string | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    title: string | null
    message: string | null
    type: $Enums.NotificationType | null
    read: boolean | null
    created_at: Date | null
    user_id: string | null
    task_id: string | null
    event_id: string | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    title: number
    message: number
    type: number
    read: number
    created_at: number
    user_id: number
    task_id: number
    event_id: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    title?: true
    message?: true
    type?: true
    read?: true
    created_at?: true
    user_id?: true
    task_id?: true
    event_id?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    title?: true
    message?: true
    type?: true
    read?: true
    created_at?: true
    user_id?: true
    task_id?: true
    event_id?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    title?: true
    message?: true
    type?: true
    read?: true
    created_at?: true
    user_id?: true
    task_id?: true
    event_id?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    title: string
    message: string
    type: $Enums.NotificationType
    read: boolean
    created_at: Date
    user_id: string
    task_id: string | null
    event_id: string | null
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    read?: boolean
    created_at?: boolean
    user_id?: boolean
    task_id?: boolean
    event_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    task?: boolean | Notification$taskArgs<ExtArgs>
    event?: boolean | Notification$eventArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    read?: boolean
    created_at?: boolean
    user_id?: boolean
    task_id?: boolean
    event_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    task?: boolean | Notification$taskArgs<ExtArgs>
    event?: boolean | Notification$eventArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    read?: boolean
    created_at?: boolean
    user_id?: boolean
    task_id?: boolean
    event_id?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    task?: boolean | Notification$taskArgs<ExtArgs>
    event?: boolean | Notification$eventArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    title?: boolean
    message?: boolean
    type?: boolean
    read?: boolean
    created_at?: boolean
    user_id?: boolean
    task_id?: boolean
    event_id?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "message" | "type" | "read" | "created_at" | "user_id" | "task_id" | "event_id", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    task?: boolean | Notification$taskArgs<ExtArgs>
    event?: boolean | Notification$eventArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    task?: boolean | Notification$taskArgs<ExtArgs>
    event?: boolean | Notification$eventArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    task?: boolean | Notification$taskArgs<ExtArgs>
    event?: boolean | Notification$eventArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      task: Prisma.$TaskPayload<ExtArgs> | null
      event: Prisma.$EventPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      message: string
      type: $Enums.NotificationType
      read: boolean
      created_at: Date
      user_id: string
      task_id: string | null
      event_id: string | null
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    task<T extends Notification$taskArgs<ExtArgs> = {}>(args?: Subset<T, Notification$taskArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    event<T extends Notification$eventArgs<ExtArgs> = {}>(args?: Subset<T, Notification$eventArgs<ExtArgs>>): Prisma__EventClient<$Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly type: FieldRef<"Notification", 'NotificationType'>
    readonly read: FieldRef<"Notification", 'Boolean'>
    readonly created_at: FieldRef<"Notification", 'DateTime'>
    readonly user_id: FieldRef<"Notification", 'String'>
    readonly task_id: FieldRef<"Notification", 'String'>
    readonly event_id: FieldRef<"Notification", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.task
   */
  export type Notification$taskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Task
     */
    omit?: TaskOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
  }

  /**
   * Notification.event
   */
  export type Notification$eventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Event
     */
    omit?: EventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventInclude<ExtArgs> | null
    where?: EventWhereInput
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    full_name: 'full_name',
    avatar_url: 'avatar_url',
    theme: 'theme',
    colorTheme: 'colorTheme',
    created_at: 'created_at',
    updated_at: 'updated_at',
    receive_task_notifications: 'receive_task_notifications',
    receive_event_notifications: 'receive_event_notifications'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    title: 'title',
    deadline: 'deadline',
    deadline_text: 'deadline_text',
    priority: 'priority',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const EventScalarFieldEnum: {
    id: 'id',
    title: 'title',
    date_time: 'date_time',
    date_time_text: 'date_time_text',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id'
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const BilanScalarFieldEnum: {
    id: 'id',
    date: 'date',
    created_at: 'created_at',
    updated_at: 'updated_at',
    user_id: 'user_id'
  };

  export type BilanScalarFieldEnum = (typeof BilanScalarFieldEnum)[keyof typeof BilanScalarFieldEnum]


  export const BilanEntryScalarFieldEnum: {
    id: 'id',
    minutes_spent: 'minutes_spent',
    notes: 'notes',
    created_at: 'created_at',
    updated_at: 'updated_at',
    bilan_id: 'bilan_id',
    task_id: 'task_id'
  };

  export type BilanEntryScalarFieldEnum = (typeof BilanEntryScalarFieldEnum)[keyof typeof BilanEntryScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    title: 'title',
    message: 'message',
    type: 'type',
    read: 'read',
    created_at: 'created_at',
    user_id: 'user_id',
    task_id: 'task_id',
    event_id: 'event_id'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType'>
    


  /**
   * Reference to a field of type 'NotificationType[]'
   */
  export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    full_name?: StringNullableFilter<"User"> | string | null
    avatar_url?: StringNullableFilter<"User"> | string | null
    theme?: StringNullableFilter<"User"> | string | null
    colorTheme?: StringNullableFilter<"User"> | string | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    receive_task_notifications?: BoolFilter<"User"> | boolean
    receive_event_notifications?: BoolFilter<"User"> | boolean
    tasks?: TaskListRelationFilter
    events?: EventListRelationFilter
    bilans?: BilanListRelationFilter
    notifications?: NotificationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    theme?: SortOrderInput | SortOrder
    colorTheme?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    receive_task_notifications?: SortOrder
    receive_event_notifications?: SortOrder
    tasks?: TaskOrderByRelationAggregateInput
    events?: EventOrderByRelationAggregateInput
    bilans?: BilanOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    full_name?: StringNullableFilter<"User"> | string | null
    avatar_url?: StringNullableFilter<"User"> | string | null
    theme?: StringNullableFilter<"User"> | string | null
    colorTheme?: StringNullableFilter<"User"> | string | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    receive_task_notifications?: BoolFilter<"User"> | boolean
    receive_event_notifications?: BoolFilter<"User"> | boolean
    tasks?: TaskListRelationFilter
    events?: EventListRelationFilter
    bilans?: BilanListRelationFilter
    notifications?: NotificationListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrderInput | SortOrder
    avatar_url?: SortOrderInput | SortOrder
    theme?: SortOrderInput | SortOrder
    colorTheme?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    receive_task_notifications?: SortOrder
    receive_event_notifications?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    full_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar_url?: StringNullableWithAggregatesFilter<"User"> | string | null
    theme?: StringNullableWithAggregatesFilter<"User"> | string | null
    colorTheme?: StringNullableWithAggregatesFilter<"User"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    receive_task_notifications?: BoolWithAggregatesFilter<"User"> | boolean
    receive_event_notifications?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    deadline?: DateTimeNullableFilter<"Task"> | Date | string | null
    deadline_text?: StringNullableFilter<"Task"> | string | null
    priority?: StringNullableFilter<"Task"> | string | null
    status?: StringNullableFilter<"Task"> | string | null
    created_at?: DateTimeFilter<"Task"> | Date | string
    updated_at?: DateTimeFilter<"Task"> | Date | string
    user_id?: StringFilter<"Task"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    bilanEntries?: BilanEntryListRelationFilter
    Notification?: NotificationListRelationFilter
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    deadline?: SortOrderInput | SortOrder
    deadline_text?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    user?: UserOrderByWithRelationInput
    bilanEntries?: BilanEntryOrderByRelationAggregateInput
    Notification?: NotificationOrderByRelationAggregateInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    title?: StringFilter<"Task"> | string
    deadline?: DateTimeNullableFilter<"Task"> | Date | string | null
    deadline_text?: StringNullableFilter<"Task"> | string | null
    priority?: StringNullableFilter<"Task"> | string | null
    status?: StringNullableFilter<"Task"> | string | null
    created_at?: DateTimeFilter<"Task"> | Date | string
    updated_at?: DateTimeFilter<"Task"> | Date | string
    user_id?: StringFilter<"Task"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    bilanEntries?: BilanEntryListRelationFilter
    Notification?: NotificationListRelationFilter
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    deadline?: SortOrderInput | SortOrder
    deadline_text?: SortOrderInput | SortOrder
    priority?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    deadline?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    deadline_text?: StringNullableWithAggregatesFilter<"Task"> | string | null
    priority?: StringNullableWithAggregatesFilter<"Task"> | string | null
    status?: StringNullableWithAggregatesFilter<"Task"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    user_id?: StringWithAggregatesFilter<"Task"> | string
  }

  export type EventWhereInput = {
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    id?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    date_time?: DateTimeNullableFilter<"Event"> | Date | string | null
    date_time_text?: StringNullableFilter<"Event"> | string | null
    created_at?: DateTimeFilter<"Event"> | Date | string
    updated_at?: DateTimeFilter<"Event"> | Date | string
    user_id?: StringFilter<"Event"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    Notification?: NotificationListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    date_time?: SortOrderInput | SortOrder
    date_time_text?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    user?: UserOrderByWithRelationInput
    Notification?: NotificationOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EventWhereInput | EventWhereInput[]
    OR?: EventWhereInput[]
    NOT?: EventWhereInput | EventWhereInput[]
    title?: StringFilter<"Event"> | string
    date_time?: DateTimeNullableFilter<"Event"> | Date | string | null
    date_time_text?: StringNullableFilter<"Event"> | string | null
    created_at?: DateTimeFilter<"Event"> | Date | string
    updated_at?: DateTimeFilter<"Event"> | Date | string
    user_id?: StringFilter<"Event"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    Notification?: NotificationListRelationFilter
  }, "id">

  export type EventOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    date_time?: SortOrderInput | SortOrder
    date_time_text?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    OR?: EventScalarWhereWithAggregatesInput[]
    NOT?: EventScalarWhereWithAggregatesInput | EventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Event"> | string
    title?: StringWithAggregatesFilter<"Event"> | string
    date_time?: DateTimeNullableWithAggregatesFilter<"Event"> | Date | string | null
    date_time_text?: StringNullableWithAggregatesFilter<"Event"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Event"> | Date | string
    user_id?: StringWithAggregatesFilter<"Event"> | string
  }

  export type BilanWhereInput = {
    AND?: BilanWhereInput | BilanWhereInput[]
    OR?: BilanWhereInput[]
    NOT?: BilanWhereInput | BilanWhereInput[]
    id?: StringFilter<"Bilan"> | string
    date?: DateTimeFilter<"Bilan"> | Date | string
    created_at?: DateTimeFilter<"Bilan"> | Date | string
    updated_at?: DateTimeFilter<"Bilan"> | Date | string
    user_id?: StringFilter<"Bilan"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    entries?: BilanEntryListRelationFilter
  }

  export type BilanOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    user?: UserOrderByWithRelationInput
    entries?: BilanEntryOrderByRelationAggregateInput
  }

  export type BilanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BilanWhereInput | BilanWhereInput[]
    OR?: BilanWhereInput[]
    NOT?: BilanWhereInput | BilanWhereInput[]
    date?: DateTimeFilter<"Bilan"> | Date | string
    created_at?: DateTimeFilter<"Bilan"> | Date | string
    updated_at?: DateTimeFilter<"Bilan"> | Date | string
    user_id?: StringFilter<"Bilan"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    entries?: BilanEntryListRelationFilter
  }, "id">

  export type BilanOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
    _count?: BilanCountOrderByAggregateInput
    _max?: BilanMaxOrderByAggregateInput
    _min?: BilanMinOrderByAggregateInput
  }

  export type BilanScalarWhereWithAggregatesInput = {
    AND?: BilanScalarWhereWithAggregatesInput | BilanScalarWhereWithAggregatesInput[]
    OR?: BilanScalarWhereWithAggregatesInput[]
    NOT?: BilanScalarWhereWithAggregatesInput | BilanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Bilan"> | string
    date?: DateTimeWithAggregatesFilter<"Bilan"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"Bilan"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Bilan"> | Date | string
    user_id?: StringWithAggregatesFilter<"Bilan"> | string
  }

  export type BilanEntryWhereInput = {
    AND?: BilanEntryWhereInput | BilanEntryWhereInput[]
    OR?: BilanEntryWhereInput[]
    NOT?: BilanEntryWhereInput | BilanEntryWhereInput[]
    id?: StringFilter<"BilanEntry"> | string
    minutes_spent?: IntFilter<"BilanEntry"> | number
    notes?: StringNullableFilter<"BilanEntry"> | string | null
    created_at?: DateTimeFilter<"BilanEntry"> | Date | string
    updated_at?: DateTimeFilter<"BilanEntry"> | Date | string
    bilan_id?: StringFilter<"BilanEntry"> | string
    task_id?: StringFilter<"BilanEntry"> | string
    bilan?: XOR<BilanScalarRelationFilter, BilanWhereInput>
    task?: XOR<TaskScalarRelationFilter, TaskWhereInput>
  }

  export type BilanEntryOrderByWithRelationInput = {
    id?: SortOrder
    minutes_spent?: SortOrder
    notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bilan_id?: SortOrder
    task_id?: SortOrder
    bilan?: BilanOrderByWithRelationInput
    task?: TaskOrderByWithRelationInput
  }

  export type BilanEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BilanEntryWhereInput | BilanEntryWhereInput[]
    OR?: BilanEntryWhereInput[]
    NOT?: BilanEntryWhereInput | BilanEntryWhereInput[]
    minutes_spent?: IntFilter<"BilanEntry"> | number
    notes?: StringNullableFilter<"BilanEntry"> | string | null
    created_at?: DateTimeFilter<"BilanEntry"> | Date | string
    updated_at?: DateTimeFilter<"BilanEntry"> | Date | string
    bilan_id?: StringFilter<"BilanEntry"> | string
    task_id?: StringFilter<"BilanEntry"> | string
    bilan?: XOR<BilanScalarRelationFilter, BilanWhereInput>
    task?: XOR<TaskScalarRelationFilter, TaskWhereInput>
  }, "id">

  export type BilanEntryOrderByWithAggregationInput = {
    id?: SortOrder
    minutes_spent?: SortOrder
    notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bilan_id?: SortOrder
    task_id?: SortOrder
    _count?: BilanEntryCountOrderByAggregateInput
    _avg?: BilanEntryAvgOrderByAggregateInput
    _max?: BilanEntryMaxOrderByAggregateInput
    _min?: BilanEntryMinOrderByAggregateInput
    _sum?: BilanEntrySumOrderByAggregateInput
  }

  export type BilanEntryScalarWhereWithAggregatesInput = {
    AND?: BilanEntryScalarWhereWithAggregatesInput | BilanEntryScalarWhereWithAggregatesInput[]
    OR?: BilanEntryScalarWhereWithAggregatesInput[]
    NOT?: BilanEntryScalarWhereWithAggregatesInput | BilanEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BilanEntry"> | string
    minutes_spent?: IntWithAggregatesFilter<"BilanEntry"> | number
    notes?: StringNullableWithAggregatesFilter<"BilanEntry"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"BilanEntry"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"BilanEntry"> | Date | string
    bilan_id?: StringWithAggregatesFilter<"BilanEntry"> | string
    task_id?: StringWithAggregatesFilter<"BilanEntry"> | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user_id?: StringFilter<"Notification"> | string
    task_id?: StringNullableFilter<"Notification"> | string | null
    event_id?: StringNullableFilter<"Notification"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    task?: XOR<TaskNullableScalarRelationFilter, TaskWhereInput> | null
    event?: XOR<EventNullableScalarRelationFilter, EventWhereInput> | null
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    task_id?: SortOrderInput | SortOrder
    event_id?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    task?: TaskOrderByWithRelationInput
    event?: EventOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user_id?: StringFilter<"Notification"> | string
    task_id?: StringNullableFilter<"Notification"> | string | null
    event_id?: StringNullableFilter<"Notification"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    task?: XOR<TaskNullableScalarRelationFilter, TaskWhereInput> | null
    event?: XOR<EventNullableScalarRelationFilter, EventWhereInput> | null
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    task_id?: SortOrderInput | SortOrder
    event_id?: SortOrderInput | SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    type?: EnumNotificationTypeWithAggregatesFilter<"Notification"> | $Enums.NotificationType
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    user_id?: StringWithAggregatesFilter<"Notification"> | string
    task_id?: StringNullableWithAggregatesFilter<"Notification"> | string | null
    event_id?: StringNullableWithAggregatesFilter<"Notification"> | string | null
  }

  export type UserCreateInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: TaskCreateNestedManyWithoutUserInput
    events?: EventCreateNestedManyWithoutUserInput
    bilans?: BilanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    bilans?: BilanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    tasks?: TaskUpdateManyWithoutUserNestedInput
    events?: EventUpdateManyWithoutUserNestedInput
    bilans?: BilanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    bilans?: BilanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutTasksInput
    bilanEntries?: BilanEntryCreateNestedManyWithoutTaskInput
    Notification?: NotificationCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
    bilanEntries?: BilanEntryUncheckedCreateNestedManyWithoutTaskInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
    bilanEntries?: BilanEntryUpdateManyWithoutTaskNestedInput
    Notification?: NotificationUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    bilanEntries?: BilanEntryUncheckedUpdateManyWithoutTaskNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskCreateManyInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
  }

  export type TaskUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TaskUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type EventCreateInput = {
    id?: string
    title: string
    date_time?: Date | string | null
    date_time_text?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutEventsInput
    Notification?: NotificationCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    id?: string
    title: string
    date_time?: Date | string | null
    date_time_text?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
    Notification?: NotificationUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
    Notification?: NotificationUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    Notification?: NotificationUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    id?: string
    title: string
    date_time?: Date | string | null
    date_time_text?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
  }

  export type EventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type BilanCreateInput = {
    id?: string
    date?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutBilansInput
    entries?: BilanEntryCreateNestedManyWithoutBilanInput
  }

  export type BilanUncheckedCreateInput = {
    id?: string
    date?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
    entries?: BilanEntryUncheckedCreateNestedManyWithoutBilanInput
  }

  export type BilanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBilansNestedInput
    entries?: BilanEntryUpdateManyWithoutBilanNestedInput
  }

  export type BilanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    entries?: BilanEntryUncheckedUpdateManyWithoutBilanNestedInput
  }

  export type BilanCreateManyInput = {
    id?: string
    date?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
  }

  export type BilanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type BilanEntryCreateInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    bilan: BilanCreateNestedOneWithoutEntriesInput
    task: TaskCreateNestedOneWithoutBilanEntriesInput
  }

  export type BilanEntryUncheckedCreateInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    bilan_id: string
    task_id: string
  }

  export type BilanEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bilan?: BilanUpdateOneRequiredWithoutEntriesNestedInput
    task?: TaskUpdateOneRequiredWithoutBilanEntriesNestedInput
  }

  export type BilanEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bilan_id?: StringFieldUpdateOperationsInput | string
    task_id?: StringFieldUpdateOperationsInput | string
  }

  export type BilanEntryCreateManyInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    bilan_id: string
    task_id: string
  }

  export type BilanEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilanEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bilan_id?: StringFieldUpdateOperationsInput | string
    task_id?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    task?: TaskCreateNestedOneWithoutNotificationInput
    event?: EventCreateNestedOneWithoutNotificationInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user_id: string
    task_id?: string | null
    event_id?: string | null
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    task?: TaskUpdateOneWithoutNotificationNestedInput
    event?: EventUpdateOneWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    task_id?: NullableStringFieldUpdateOperationsInput | string | null
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationCreateManyInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user_id: string
    task_id?: string | null
    event_id?: string | null
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    task_id?: NullableStringFieldUpdateOperationsInput | string | null
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type EventListRelationFilter = {
    every?: EventWhereInput
    some?: EventWhereInput
    none?: EventWhereInput
  }

  export type BilanListRelationFilter = {
    every?: BilanWhereInput
    some?: BilanWhereInput
    none?: BilanWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BilanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    theme?: SortOrder
    colorTheme?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    receive_task_notifications?: SortOrder
    receive_event_notifications?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    theme?: SortOrder
    colorTheme?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    receive_task_notifications?: SortOrder
    receive_event_notifications?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    theme?: SortOrder
    colorTheme?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    receive_task_notifications?: SortOrder
    receive_event_notifications?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type BilanEntryListRelationFilter = {
    every?: BilanEntryWhereInput
    some?: BilanEntryWhereInput
    none?: BilanEntryWhereInput
  }

  export type BilanEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    deadline?: SortOrder
    deadline_text?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    deadline?: SortOrder
    deadline_text?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    deadline?: SortOrder
    deadline_text?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EventCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date_time?: SortOrder
    date_time_text?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date_time?: SortOrder
    date_time_text?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    date_time?: SortOrder
    date_time_text?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type BilanCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type BilanMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type BilanMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user_id?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BilanScalarRelationFilter = {
    is?: BilanWhereInput
    isNot?: BilanWhereInput
  }

  export type TaskScalarRelationFilter = {
    is?: TaskWhereInput
    isNot?: TaskWhereInput
  }

  export type BilanEntryCountOrderByAggregateInput = {
    id?: SortOrder
    minutes_spent?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bilan_id?: SortOrder
    task_id?: SortOrder
  }

  export type BilanEntryAvgOrderByAggregateInput = {
    minutes_spent?: SortOrder
  }

  export type BilanEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    minutes_spent?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bilan_id?: SortOrder
    task_id?: SortOrder
  }

  export type BilanEntryMinOrderByAggregateInput = {
    id?: SortOrder
    minutes_spent?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    bilan_id?: SortOrder
    task_id?: SortOrder
  }

  export type BilanEntrySumOrderByAggregateInput = {
    minutes_spent?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type TaskNullableScalarRelationFilter = {
    is?: TaskWhereInput | null
    isNot?: TaskWhereInput | null
  }

  export type EventNullableScalarRelationFilter = {
    is?: EventWhereInput | null
    isNot?: EventWhereInput | null
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    task_id?: SortOrder
    event_id?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    task_id?: SortOrder
    event_id?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    type?: SortOrder
    read?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    task_id?: SortOrder
    event_id?: SortOrder
  }

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type TaskCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type EventCreateNestedManyWithoutUserInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type BilanCreateNestedManyWithoutUserInput = {
    create?: XOR<BilanCreateWithoutUserInput, BilanUncheckedCreateWithoutUserInput> | BilanCreateWithoutUserInput[] | BilanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BilanCreateOrConnectWithoutUserInput | BilanCreateOrConnectWithoutUserInput[]
    createMany?: BilanCreateManyUserInputEnvelope
    connect?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type EventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
  }

  export type BilanUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BilanCreateWithoutUserInput, BilanUncheckedCreateWithoutUserInput> | BilanCreateWithoutUserInput[] | BilanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BilanCreateOrConnectWithoutUserInput | BilanCreateOrConnectWithoutUserInput[]
    createMany?: BilanCreateManyUserInputEnvelope
    connect?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TaskUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutUserInput | TaskUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutUserInput | TaskUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutUserInput | TaskUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type EventUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutUserInput | EventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutUserInput | EventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventUpdateManyWithWhereWithoutUserInput | EventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type BilanUpdateManyWithoutUserNestedInput = {
    create?: XOR<BilanCreateWithoutUserInput, BilanUncheckedCreateWithoutUserInput> | BilanCreateWithoutUserInput[] | BilanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BilanCreateOrConnectWithoutUserInput | BilanCreateOrConnectWithoutUserInput[]
    upsert?: BilanUpsertWithWhereUniqueWithoutUserInput | BilanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BilanCreateManyUserInputEnvelope
    set?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
    disconnect?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
    delete?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
    connect?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
    update?: BilanUpdateWithWhereUniqueWithoutUserInput | BilanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BilanUpdateManyWithWhereWithoutUserInput | BilanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BilanScalarWhereInput | BilanScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput> | TaskCreateWithoutUserInput[] | TaskUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutUserInput | TaskCreateOrConnectWithoutUserInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutUserInput | TaskUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaskCreateManyUserInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutUserInput | TaskUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutUserInput | TaskUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type EventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput> | EventCreateWithoutUserInput[] | EventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventCreateOrConnectWithoutUserInput | EventCreateOrConnectWithoutUserInput[]
    upsert?: EventUpsertWithWhereUniqueWithoutUserInput | EventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventCreateManyUserInputEnvelope
    set?: EventWhereUniqueInput | EventWhereUniqueInput[]
    disconnect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    delete?: EventWhereUniqueInput | EventWhereUniqueInput[]
    connect?: EventWhereUniqueInput | EventWhereUniqueInput[]
    update?: EventUpdateWithWhereUniqueWithoutUserInput | EventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventUpdateManyWithWhereWithoutUserInput | EventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventScalarWhereInput | EventScalarWhereInput[]
  }

  export type BilanUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BilanCreateWithoutUserInput, BilanUncheckedCreateWithoutUserInput> | BilanCreateWithoutUserInput[] | BilanUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BilanCreateOrConnectWithoutUserInput | BilanCreateOrConnectWithoutUserInput[]
    upsert?: BilanUpsertWithWhereUniqueWithoutUserInput | BilanUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BilanCreateManyUserInputEnvelope
    set?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
    disconnect?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
    delete?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
    connect?: BilanWhereUniqueInput | BilanWhereUniqueInput[]
    update?: BilanUpdateWithWhereUniqueWithoutUserInput | BilanUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BilanUpdateManyWithWhereWithoutUserInput | BilanUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BilanScalarWhereInput | BilanScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTasksInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    connect?: UserWhereUniqueInput
  }

  export type BilanEntryCreateNestedManyWithoutTaskInput = {
    create?: XOR<BilanEntryCreateWithoutTaskInput, BilanEntryUncheckedCreateWithoutTaskInput> | BilanEntryCreateWithoutTaskInput[] | BilanEntryUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: BilanEntryCreateOrConnectWithoutTaskInput | BilanEntryCreateOrConnectWithoutTaskInput[]
    createMany?: BilanEntryCreateManyTaskInputEnvelope
    connect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutTaskInput = {
    create?: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput> | NotificationCreateWithoutTaskInput[] | NotificationUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTaskInput | NotificationCreateOrConnectWithoutTaskInput[]
    createMany?: NotificationCreateManyTaskInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type BilanEntryUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<BilanEntryCreateWithoutTaskInput, BilanEntryUncheckedCreateWithoutTaskInput> | BilanEntryCreateWithoutTaskInput[] | BilanEntryUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: BilanEntryCreateOrConnectWithoutTaskInput | BilanEntryCreateOrConnectWithoutTaskInput[]
    createMany?: BilanEntryCreateManyTaskInputEnvelope
    connect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutTaskInput = {
    create?: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput> | NotificationCreateWithoutTaskInput[] | NotificationUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTaskInput | NotificationCreateOrConnectWithoutTaskInput[]
    createMany?: NotificationCreateManyTaskInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutTasksInput
    upsert?: UserUpsertWithoutTasksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTasksInput, UserUpdateWithoutTasksInput>, UserUncheckedUpdateWithoutTasksInput>
  }

  export type BilanEntryUpdateManyWithoutTaskNestedInput = {
    create?: XOR<BilanEntryCreateWithoutTaskInput, BilanEntryUncheckedCreateWithoutTaskInput> | BilanEntryCreateWithoutTaskInput[] | BilanEntryUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: BilanEntryCreateOrConnectWithoutTaskInput | BilanEntryCreateOrConnectWithoutTaskInput[]
    upsert?: BilanEntryUpsertWithWhereUniqueWithoutTaskInput | BilanEntryUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: BilanEntryCreateManyTaskInputEnvelope
    set?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    disconnect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    delete?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    connect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    update?: BilanEntryUpdateWithWhereUniqueWithoutTaskInput | BilanEntryUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: BilanEntryUpdateManyWithWhereWithoutTaskInput | BilanEntryUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: BilanEntryScalarWhereInput | BilanEntryScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutTaskNestedInput = {
    create?: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput> | NotificationCreateWithoutTaskInput[] | NotificationUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTaskInput | NotificationCreateOrConnectWithoutTaskInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTaskInput | NotificationUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: NotificationCreateManyTaskInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTaskInput | NotificationUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTaskInput | NotificationUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type BilanEntryUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<BilanEntryCreateWithoutTaskInput, BilanEntryUncheckedCreateWithoutTaskInput> | BilanEntryCreateWithoutTaskInput[] | BilanEntryUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: BilanEntryCreateOrConnectWithoutTaskInput | BilanEntryCreateOrConnectWithoutTaskInput[]
    upsert?: BilanEntryUpsertWithWhereUniqueWithoutTaskInput | BilanEntryUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: BilanEntryCreateManyTaskInputEnvelope
    set?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    disconnect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    delete?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    connect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    update?: BilanEntryUpdateWithWhereUniqueWithoutTaskInput | BilanEntryUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: BilanEntryUpdateManyWithWhereWithoutTaskInput | BilanEntryUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: BilanEntryScalarWhereInput | BilanEntryScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutTaskNestedInput = {
    create?: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput> | NotificationCreateWithoutTaskInput[] | NotificationUncheckedCreateWithoutTaskInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutTaskInput | NotificationCreateOrConnectWithoutTaskInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutTaskInput | NotificationUpsertWithWhereUniqueWithoutTaskInput[]
    createMany?: NotificationCreateManyTaskInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutTaskInput | NotificationUpdateWithWhereUniqueWithoutTaskInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutTaskInput | NotificationUpdateManyWithWhereWithoutTaskInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutEventsInput = {
    create?: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventsInput
    connect?: UserWhereUniqueInput
  }

  export type NotificationCreateNestedManyWithoutEventInput = {
    create?: XOR<NotificationCreateWithoutEventInput, NotificationUncheckedCreateWithoutEventInput> | NotificationCreateWithoutEventInput[] | NotificationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutEventInput | NotificationCreateOrConnectWithoutEventInput[]
    createMany?: NotificationCreateManyEventInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<NotificationCreateWithoutEventInput, NotificationUncheckedCreateWithoutEventInput> | NotificationCreateWithoutEventInput[] | NotificationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutEventInput | NotificationCreateOrConnectWithoutEventInput[]
    createMany?: NotificationCreateManyEventInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventsInput
    upsert?: UserUpsertWithoutEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEventsInput, UserUpdateWithoutEventsInput>, UserUncheckedUpdateWithoutEventsInput>
  }

  export type NotificationUpdateManyWithoutEventNestedInput = {
    create?: XOR<NotificationCreateWithoutEventInput, NotificationUncheckedCreateWithoutEventInput> | NotificationCreateWithoutEventInput[] | NotificationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutEventInput | NotificationCreateOrConnectWithoutEventInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutEventInput | NotificationUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: NotificationCreateManyEventInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutEventInput | NotificationUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutEventInput | NotificationUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<NotificationCreateWithoutEventInput, NotificationUncheckedCreateWithoutEventInput> | NotificationCreateWithoutEventInput[] | NotificationUncheckedCreateWithoutEventInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutEventInput | NotificationCreateOrConnectWithoutEventInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutEventInput | NotificationUpsertWithWhereUniqueWithoutEventInput[]
    createMany?: NotificationCreateManyEventInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutEventInput | NotificationUpdateWithWhereUniqueWithoutEventInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutEventInput | NotificationUpdateManyWithWhereWithoutEventInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBilansInput = {
    create?: XOR<UserCreateWithoutBilansInput, UserUncheckedCreateWithoutBilansInput>
    connectOrCreate?: UserCreateOrConnectWithoutBilansInput
    connect?: UserWhereUniqueInput
  }

  export type BilanEntryCreateNestedManyWithoutBilanInput = {
    create?: XOR<BilanEntryCreateWithoutBilanInput, BilanEntryUncheckedCreateWithoutBilanInput> | BilanEntryCreateWithoutBilanInput[] | BilanEntryUncheckedCreateWithoutBilanInput[]
    connectOrCreate?: BilanEntryCreateOrConnectWithoutBilanInput | BilanEntryCreateOrConnectWithoutBilanInput[]
    createMany?: BilanEntryCreateManyBilanInputEnvelope
    connect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
  }

  export type BilanEntryUncheckedCreateNestedManyWithoutBilanInput = {
    create?: XOR<BilanEntryCreateWithoutBilanInput, BilanEntryUncheckedCreateWithoutBilanInput> | BilanEntryCreateWithoutBilanInput[] | BilanEntryUncheckedCreateWithoutBilanInput[]
    connectOrCreate?: BilanEntryCreateOrConnectWithoutBilanInput | BilanEntryCreateOrConnectWithoutBilanInput[]
    createMany?: BilanEntryCreateManyBilanInputEnvelope
    connect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutBilansNestedInput = {
    create?: XOR<UserCreateWithoutBilansInput, UserUncheckedCreateWithoutBilansInput>
    connectOrCreate?: UserCreateOrConnectWithoutBilansInput
    upsert?: UserUpsertWithoutBilansInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBilansInput, UserUpdateWithoutBilansInput>, UserUncheckedUpdateWithoutBilansInput>
  }

  export type BilanEntryUpdateManyWithoutBilanNestedInput = {
    create?: XOR<BilanEntryCreateWithoutBilanInput, BilanEntryUncheckedCreateWithoutBilanInput> | BilanEntryCreateWithoutBilanInput[] | BilanEntryUncheckedCreateWithoutBilanInput[]
    connectOrCreate?: BilanEntryCreateOrConnectWithoutBilanInput | BilanEntryCreateOrConnectWithoutBilanInput[]
    upsert?: BilanEntryUpsertWithWhereUniqueWithoutBilanInput | BilanEntryUpsertWithWhereUniqueWithoutBilanInput[]
    createMany?: BilanEntryCreateManyBilanInputEnvelope
    set?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    disconnect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    delete?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    connect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    update?: BilanEntryUpdateWithWhereUniqueWithoutBilanInput | BilanEntryUpdateWithWhereUniqueWithoutBilanInput[]
    updateMany?: BilanEntryUpdateManyWithWhereWithoutBilanInput | BilanEntryUpdateManyWithWhereWithoutBilanInput[]
    deleteMany?: BilanEntryScalarWhereInput | BilanEntryScalarWhereInput[]
  }

  export type BilanEntryUncheckedUpdateManyWithoutBilanNestedInput = {
    create?: XOR<BilanEntryCreateWithoutBilanInput, BilanEntryUncheckedCreateWithoutBilanInput> | BilanEntryCreateWithoutBilanInput[] | BilanEntryUncheckedCreateWithoutBilanInput[]
    connectOrCreate?: BilanEntryCreateOrConnectWithoutBilanInput | BilanEntryCreateOrConnectWithoutBilanInput[]
    upsert?: BilanEntryUpsertWithWhereUniqueWithoutBilanInput | BilanEntryUpsertWithWhereUniqueWithoutBilanInput[]
    createMany?: BilanEntryCreateManyBilanInputEnvelope
    set?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    disconnect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    delete?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    connect?: BilanEntryWhereUniqueInput | BilanEntryWhereUniqueInput[]
    update?: BilanEntryUpdateWithWhereUniqueWithoutBilanInput | BilanEntryUpdateWithWhereUniqueWithoutBilanInput[]
    updateMany?: BilanEntryUpdateManyWithWhereWithoutBilanInput | BilanEntryUpdateManyWithWhereWithoutBilanInput[]
    deleteMany?: BilanEntryScalarWhereInput | BilanEntryScalarWhereInput[]
  }

  export type BilanCreateNestedOneWithoutEntriesInput = {
    create?: XOR<BilanCreateWithoutEntriesInput, BilanUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: BilanCreateOrConnectWithoutEntriesInput
    connect?: BilanWhereUniqueInput
  }

  export type TaskCreateNestedOneWithoutBilanEntriesInput = {
    create?: XOR<TaskCreateWithoutBilanEntriesInput, TaskUncheckedCreateWithoutBilanEntriesInput>
    connectOrCreate?: TaskCreateOrConnectWithoutBilanEntriesInput
    connect?: TaskWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BilanUpdateOneRequiredWithoutEntriesNestedInput = {
    create?: XOR<BilanCreateWithoutEntriesInput, BilanUncheckedCreateWithoutEntriesInput>
    connectOrCreate?: BilanCreateOrConnectWithoutEntriesInput
    upsert?: BilanUpsertWithoutEntriesInput
    connect?: BilanWhereUniqueInput
    update?: XOR<XOR<BilanUpdateToOneWithWhereWithoutEntriesInput, BilanUpdateWithoutEntriesInput>, BilanUncheckedUpdateWithoutEntriesInput>
  }

  export type TaskUpdateOneRequiredWithoutBilanEntriesNestedInput = {
    create?: XOR<TaskCreateWithoutBilanEntriesInput, TaskUncheckedCreateWithoutBilanEntriesInput>
    connectOrCreate?: TaskCreateOrConnectWithoutBilanEntriesInput
    upsert?: TaskUpsertWithoutBilanEntriesInput
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutBilanEntriesInput, TaskUpdateWithoutBilanEntriesInput>, TaskUncheckedUpdateWithoutBilanEntriesInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type TaskCreateNestedOneWithoutNotificationInput = {
    create?: XOR<TaskCreateWithoutNotificationInput, TaskUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: TaskCreateOrConnectWithoutNotificationInput
    connect?: TaskWhereUniqueInput
  }

  export type EventCreateNestedOneWithoutNotificationInput = {
    create?: XOR<EventCreateWithoutNotificationInput, EventUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: EventCreateOrConnectWithoutNotificationInput
    connect?: EventWhereUniqueInput
  }

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type TaskUpdateOneWithoutNotificationNestedInput = {
    create?: XOR<TaskCreateWithoutNotificationInput, TaskUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: TaskCreateOrConnectWithoutNotificationInput
    upsert?: TaskUpsertWithoutNotificationInput
    disconnect?: TaskWhereInput | boolean
    delete?: TaskWhereInput | boolean
    connect?: TaskWhereUniqueInput
    update?: XOR<XOR<TaskUpdateToOneWithWhereWithoutNotificationInput, TaskUpdateWithoutNotificationInput>, TaskUncheckedUpdateWithoutNotificationInput>
  }

  export type EventUpdateOneWithoutNotificationNestedInput = {
    create?: XOR<EventCreateWithoutNotificationInput, EventUncheckedCreateWithoutNotificationInput>
    connectOrCreate?: EventCreateOrConnectWithoutNotificationInput
    upsert?: EventUpsertWithoutNotificationInput
    disconnect?: EventWhereInput | boolean
    delete?: EventWhereInput | boolean
    connect?: EventWhereUniqueInput
    update?: XOR<XOR<EventUpdateToOneWithWhereWithoutNotificationInput, EventUpdateWithoutNotificationInput>, EventUncheckedUpdateWithoutNotificationInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeFilter<$PrismaModel> | $Enums.NotificationType
  }

  export type NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.NotificationType | EnumNotificationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.NotificationType[] | ListEnumNotificationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel> | $Enums.NotificationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>
  }

  export type TaskCreateWithoutUserInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    bilanEntries?: BilanEntryCreateNestedManyWithoutTaskInput
    Notification?: NotificationCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    bilanEntries?: BilanEntryUncheckedCreateNestedManyWithoutTaskInput
    Notification?: NotificationUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutUserInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput>
  }

  export type TaskCreateManyUserInputEnvelope = {
    data: TaskCreateManyUserInput | TaskCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EventCreateWithoutUserInput = {
    id?: string
    title: string
    date_time?: Date | string | null
    date_time_text?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    Notification?: NotificationCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    date_time?: Date | string | null
    date_time_text?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    Notification?: NotificationUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventCreateOrConnectWithoutUserInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput>
  }

  export type EventCreateManyUserInputEnvelope = {
    data: EventCreateManyUserInput | EventCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BilanCreateWithoutUserInput = {
    id?: string
    date?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
    entries?: BilanEntryCreateNestedManyWithoutBilanInput
  }

  export type BilanUncheckedCreateWithoutUserInput = {
    id?: string
    date?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
    entries?: BilanEntryUncheckedCreateNestedManyWithoutBilanInput
  }

  export type BilanCreateOrConnectWithoutUserInput = {
    where: BilanWhereUniqueInput
    create: XOR<BilanCreateWithoutUserInput, BilanUncheckedCreateWithoutUserInput>
  }

  export type BilanCreateManyUserInputEnvelope = {
    data: BilanCreateManyUserInput | BilanCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    task?: TaskCreateNestedOneWithoutNotificationInput
    event?: EventCreateNestedOneWithoutNotificationInput
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    task_id?: string | null
    event_id?: string | null
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TaskUpsertWithWhereUniqueWithoutUserInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutUserInput, TaskUncheckedUpdateWithoutUserInput>
    create: XOR<TaskCreateWithoutUserInput, TaskUncheckedCreateWithoutUserInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutUserInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutUserInput, TaskUncheckedUpdateWithoutUserInput>
  }

  export type TaskUpdateManyWithWhereWithoutUserInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutUserInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    deadline?: DateTimeNullableFilter<"Task"> | Date | string | null
    deadline_text?: StringNullableFilter<"Task"> | string | null
    priority?: StringNullableFilter<"Task"> | string | null
    status?: StringNullableFilter<"Task"> | string | null
    created_at?: DateTimeFilter<"Task"> | Date | string
    updated_at?: DateTimeFilter<"Task"> | Date | string
    user_id?: StringFilter<"Task"> | string
  }

  export type EventUpsertWithWhereUniqueWithoutUserInput = {
    where: EventWhereUniqueInput
    update: XOR<EventUpdateWithoutUserInput, EventUncheckedUpdateWithoutUserInput>
    create: XOR<EventCreateWithoutUserInput, EventUncheckedCreateWithoutUserInput>
  }

  export type EventUpdateWithWhereUniqueWithoutUserInput = {
    where: EventWhereUniqueInput
    data: XOR<EventUpdateWithoutUserInput, EventUncheckedUpdateWithoutUserInput>
  }

  export type EventUpdateManyWithWhereWithoutUserInput = {
    where: EventScalarWhereInput
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyWithoutUserInput>
  }

  export type EventScalarWhereInput = {
    AND?: EventScalarWhereInput | EventScalarWhereInput[]
    OR?: EventScalarWhereInput[]
    NOT?: EventScalarWhereInput | EventScalarWhereInput[]
    id?: StringFilter<"Event"> | string
    title?: StringFilter<"Event"> | string
    date_time?: DateTimeNullableFilter<"Event"> | Date | string | null
    date_time_text?: StringNullableFilter<"Event"> | string | null
    created_at?: DateTimeFilter<"Event"> | Date | string
    updated_at?: DateTimeFilter<"Event"> | Date | string
    user_id?: StringFilter<"Event"> | string
  }

  export type BilanUpsertWithWhereUniqueWithoutUserInput = {
    where: BilanWhereUniqueInput
    update: XOR<BilanUpdateWithoutUserInput, BilanUncheckedUpdateWithoutUserInput>
    create: XOR<BilanCreateWithoutUserInput, BilanUncheckedCreateWithoutUserInput>
  }

  export type BilanUpdateWithWhereUniqueWithoutUserInput = {
    where: BilanWhereUniqueInput
    data: XOR<BilanUpdateWithoutUserInput, BilanUncheckedUpdateWithoutUserInput>
  }

  export type BilanUpdateManyWithWhereWithoutUserInput = {
    where: BilanScalarWhereInput
    data: XOR<BilanUpdateManyMutationInput, BilanUncheckedUpdateManyWithoutUserInput>
  }

  export type BilanScalarWhereInput = {
    AND?: BilanScalarWhereInput | BilanScalarWhereInput[]
    OR?: BilanScalarWhereInput[]
    NOT?: BilanScalarWhereInput | BilanScalarWhereInput[]
    id?: StringFilter<"Bilan"> | string
    date?: DateTimeFilter<"Bilan"> | Date | string
    created_at?: DateTimeFilter<"Bilan"> | Date | string
    updated_at?: DateTimeFilter<"Bilan"> | Date | string
    user_id?: StringFilter<"Bilan"> | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: StringFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    type?: EnumNotificationTypeFilter<"Notification"> | $Enums.NotificationType
    read?: BoolFilter<"Notification"> | boolean
    created_at?: DateTimeFilter<"Notification"> | Date | string
    user_id?: StringFilter<"Notification"> | string
    task_id?: StringNullableFilter<"Notification"> | string | null
    event_id?: StringNullableFilter<"Notification"> | string | null
  }

  export type UserCreateWithoutTasksInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    events?: EventCreateNestedManyWithoutUserInput
    bilans?: BilanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTasksInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    bilans?: BilanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
  }

  export type BilanEntryCreateWithoutTaskInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    bilan: BilanCreateNestedOneWithoutEntriesInput
  }

  export type BilanEntryUncheckedCreateWithoutTaskInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    bilan_id: string
  }

  export type BilanEntryCreateOrConnectWithoutTaskInput = {
    where: BilanEntryWhereUniqueInput
    create: XOR<BilanEntryCreateWithoutTaskInput, BilanEntryUncheckedCreateWithoutTaskInput>
  }

  export type BilanEntryCreateManyTaskInputEnvelope = {
    data: BilanEntryCreateManyTaskInput | BilanEntryCreateManyTaskInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutTaskInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    event?: EventCreateNestedOneWithoutNotificationInput
  }

  export type NotificationUncheckedCreateWithoutTaskInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user_id: string
    event_id?: string | null
  }

  export type NotificationCreateOrConnectWithoutTaskInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput>
  }

  export type NotificationCreateManyTaskInputEnvelope = {
    data: NotificationCreateManyTaskInput | NotificationCreateManyTaskInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTasksInput = {
    update: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
    create: XOR<UserCreateWithoutTasksInput, UserUncheckedCreateWithoutTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTasksInput, UserUncheckedUpdateWithoutTasksInput>
  }

  export type UserUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    events?: EventUpdateManyWithoutUserNestedInput
    bilans?: BilanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    bilans?: BilanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BilanEntryUpsertWithWhereUniqueWithoutTaskInput = {
    where: BilanEntryWhereUniqueInput
    update: XOR<BilanEntryUpdateWithoutTaskInput, BilanEntryUncheckedUpdateWithoutTaskInput>
    create: XOR<BilanEntryCreateWithoutTaskInput, BilanEntryUncheckedCreateWithoutTaskInput>
  }

  export type BilanEntryUpdateWithWhereUniqueWithoutTaskInput = {
    where: BilanEntryWhereUniqueInput
    data: XOR<BilanEntryUpdateWithoutTaskInput, BilanEntryUncheckedUpdateWithoutTaskInput>
  }

  export type BilanEntryUpdateManyWithWhereWithoutTaskInput = {
    where: BilanEntryScalarWhereInput
    data: XOR<BilanEntryUpdateManyMutationInput, BilanEntryUncheckedUpdateManyWithoutTaskInput>
  }

  export type BilanEntryScalarWhereInput = {
    AND?: BilanEntryScalarWhereInput | BilanEntryScalarWhereInput[]
    OR?: BilanEntryScalarWhereInput[]
    NOT?: BilanEntryScalarWhereInput | BilanEntryScalarWhereInput[]
    id?: StringFilter<"BilanEntry"> | string
    minutes_spent?: IntFilter<"BilanEntry"> | number
    notes?: StringNullableFilter<"BilanEntry"> | string | null
    created_at?: DateTimeFilter<"BilanEntry"> | Date | string
    updated_at?: DateTimeFilter<"BilanEntry"> | Date | string
    bilan_id?: StringFilter<"BilanEntry"> | string
    task_id?: StringFilter<"BilanEntry"> | string
  }

  export type NotificationUpsertWithWhereUniqueWithoutTaskInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutTaskInput, NotificationUncheckedUpdateWithoutTaskInput>
    create: XOR<NotificationCreateWithoutTaskInput, NotificationUncheckedCreateWithoutTaskInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutTaskInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutTaskInput, NotificationUncheckedUpdateWithoutTaskInput>
  }

  export type NotificationUpdateManyWithWhereWithoutTaskInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutTaskInput>
  }

  export type UserCreateWithoutEventsInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: TaskCreateNestedManyWithoutUserInput
    bilans?: BilanCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEventsInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    bilans?: BilanUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
  }

  export type NotificationCreateWithoutEventInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user: UserCreateNestedOneWithoutNotificationsInput
    task?: TaskCreateNestedOneWithoutNotificationInput
  }

  export type NotificationUncheckedCreateWithoutEventInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user_id: string
    task_id?: string | null
  }

  export type NotificationCreateOrConnectWithoutEventInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutEventInput, NotificationUncheckedCreateWithoutEventInput>
  }

  export type NotificationCreateManyEventInputEnvelope = {
    data: NotificationCreateManyEventInput | NotificationCreateManyEventInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutEventsInput = {
    update: XOR<UserUpdateWithoutEventsInput, UserUncheckedUpdateWithoutEventsInput>
    create: XOR<UserCreateWithoutEventsInput, UserUncheckedCreateWithoutEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEventsInput, UserUncheckedUpdateWithoutEventsInput>
  }

  export type UserUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    tasks?: TaskUpdateManyWithoutUserNestedInput
    bilans?: BilanUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    bilans?: BilanUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type NotificationUpsertWithWhereUniqueWithoutEventInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutEventInput, NotificationUncheckedUpdateWithoutEventInput>
    create: XOR<NotificationCreateWithoutEventInput, NotificationUncheckedCreateWithoutEventInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutEventInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutEventInput, NotificationUncheckedUpdateWithoutEventInput>
  }

  export type NotificationUpdateManyWithWhereWithoutEventInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutEventInput>
  }

  export type UserCreateWithoutBilansInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: TaskCreateNestedManyWithoutUserInput
    events?: EventCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBilansInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBilansInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBilansInput, UserUncheckedCreateWithoutBilansInput>
  }

  export type BilanEntryCreateWithoutBilanInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    task: TaskCreateNestedOneWithoutBilanEntriesInput
  }

  export type BilanEntryUncheckedCreateWithoutBilanInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    task_id: string
  }

  export type BilanEntryCreateOrConnectWithoutBilanInput = {
    where: BilanEntryWhereUniqueInput
    create: XOR<BilanEntryCreateWithoutBilanInput, BilanEntryUncheckedCreateWithoutBilanInput>
  }

  export type BilanEntryCreateManyBilanInputEnvelope = {
    data: BilanEntryCreateManyBilanInput | BilanEntryCreateManyBilanInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutBilansInput = {
    update: XOR<UserUpdateWithoutBilansInput, UserUncheckedUpdateWithoutBilansInput>
    create: XOR<UserCreateWithoutBilansInput, UserUncheckedCreateWithoutBilansInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBilansInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBilansInput, UserUncheckedUpdateWithoutBilansInput>
  }

  export type UserUpdateWithoutBilansInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    tasks?: TaskUpdateManyWithoutUserNestedInput
    events?: EventUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBilansInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type BilanEntryUpsertWithWhereUniqueWithoutBilanInput = {
    where: BilanEntryWhereUniqueInput
    update: XOR<BilanEntryUpdateWithoutBilanInput, BilanEntryUncheckedUpdateWithoutBilanInput>
    create: XOR<BilanEntryCreateWithoutBilanInput, BilanEntryUncheckedCreateWithoutBilanInput>
  }

  export type BilanEntryUpdateWithWhereUniqueWithoutBilanInput = {
    where: BilanEntryWhereUniqueInput
    data: XOR<BilanEntryUpdateWithoutBilanInput, BilanEntryUncheckedUpdateWithoutBilanInput>
  }

  export type BilanEntryUpdateManyWithWhereWithoutBilanInput = {
    where: BilanEntryScalarWhereInput
    data: XOR<BilanEntryUpdateManyMutationInput, BilanEntryUncheckedUpdateManyWithoutBilanInput>
  }

  export type BilanCreateWithoutEntriesInput = {
    id?: string
    date?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutBilansInput
  }

  export type BilanUncheckedCreateWithoutEntriesInput = {
    id?: string
    date?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
  }

  export type BilanCreateOrConnectWithoutEntriesInput = {
    where: BilanWhereUniqueInput
    create: XOR<BilanCreateWithoutEntriesInput, BilanUncheckedCreateWithoutEntriesInput>
  }

  export type TaskCreateWithoutBilanEntriesInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutTasksInput
    Notification?: NotificationCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutBilanEntriesInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
    Notification?: NotificationUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutBilanEntriesInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutBilanEntriesInput, TaskUncheckedCreateWithoutBilanEntriesInput>
  }

  export type BilanUpsertWithoutEntriesInput = {
    update: XOR<BilanUpdateWithoutEntriesInput, BilanUncheckedUpdateWithoutEntriesInput>
    create: XOR<BilanCreateWithoutEntriesInput, BilanUncheckedCreateWithoutEntriesInput>
    where?: BilanWhereInput
  }

  export type BilanUpdateToOneWithWhereWithoutEntriesInput = {
    where?: BilanWhereInput
    data: XOR<BilanUpdateWithoutEntriesInput, BilanUncheckedUpdateWithoutEntriesInput>
  }

  export type BilanUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBilansNestedInput
  }

  export type BilanUncheckedUpdateWithoutEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type TaskUpsertWithoutBilanEntriesInput = {
    update: XOR<TaskUpdateWithoutBilanEntriesInput, TaskUncheckedUpdateWithoutBilanEntriesInput>
    create: XOR<TaskCreateWithoutBilanEntriesInput, TaskUncheckedCreateWithoutBilanEntriesInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutBilanEntriesInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutBilanEntriesInput, TaskUncheckedUpdateWithoutBilanEntriesInput>
  }

  export type TaskUpdateWithoutBilanEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
    Notification?: NotificationUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutBilanEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    Notification?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: TaskCreateNestedManyWithoutUserInput
    events?: EventCreateNestedManyWithoutUserInput
    bilans?: BilanCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id: string
    email: string
    full_name?: string | null
    avatar_url?: string | null
    theme?: string | null
    colorTheme?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    receive_task_notifications?: boolean
    receive_event_notifications?: boolean
    tasks?: TaskUncheckedCreateNestedManyWithoutUserInput
    events?: EventUncheckedCreateNestedManyWithoutUserInput
    bilans?: BilanUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type TaskCreateWithoutNotificationInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutTasksInput
    bilanEntries?: BilanEntryCreateNestedManyWithoutTaskInput
  }

  export type TaskUncheckedCreateWithoutNotificationInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
    bilanEntries?: BilanEntryUncheckedCreateNestedManyWithoutTaskInput
  }

  export type TaskCreateOrConnectWithoutNotificationInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutNotificationInput, TaskUncheckedCreateWithoutNotificationInput>
  }

  export type EventCreateWithoutNotificationInput = {
    id?: string
    title: string
    date_time?: Date | string | null
    date_time_text?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutEventsInput
  }

  export type EventUncheckedCreateWithoutNotificationInput = {
    id?: string
    title: string
    date_time?: Date | string | null
    date_time_text?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    user_id: string
  }

  export type EventCreateOrConnectWithoutNotificationInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutNotificationInput, EventUncheckedCreateWithoutNotificationInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    tasks?: TaskUpdateManyWithoutUserNestedInput
    events?: EventUpdateManyWithoutUserNestedInput
    bilans?: BilanUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    full_name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: NullableStringFieldUpdateOperationsInput | string | null
    colorTheme?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    receive_task_notifications?: BoolFieldUpdateOperationsInput | boolean
    receive_event_notifications?: BoolFieldUpdateOperationsInput | boolean
    tasks?: TaskUncheckedUpdateManyWithoutUserNestedInput
    events?: EventUncheckedUpdateManyWithoutUserNestedInput
    bilans?: BilanUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TaskUpsertWithoutNotificationInput = {
    update: XOR<TaskUpdateWithoutNotificationInput, TaskUncheckedUpdateWithoutNotificationInput>
    create: XOR<TaskCreateWithoutNotificationInput, TaskUncheckedCreateWithoutNotificationInput>
    where?: TaskWhereInput
  }

  export type TaskUpdateToOneWithWhereWithoutNotificationInput = {
    where?: TaskWhereInput
    data: XOR<TaskUpdateWithoutNotificationInput, TaskUncheckedUpdateWithoutNotificationInput>
  }

  export type TaskUpdateWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTasksNestedInput
    bilanEntries?: BilanEntryUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    bilanEntries?: BilanEntryUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type EventUpsertWithoutNotificationInput = {
    update: XOR<EventUpdateWithoutNotificationInput, EventUncheckedUpdateWithoutNotificationInput>
    create: XOR<EventCreateWithoutNotificationInput, EventUncheckedCreateWithoutNotificationInput>
    where?: EventWhereInput
  }

  export type EventUpdateToOneWithWhereWithoutNotificationInput = {
    where?: EventWhereInput
    data: XOR<EventUpdateWithoutNotificationInput, EventUncheckedUpdateWithoutNotificationInput>
  }

  export type EventUpdateWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutEventsNestedInput
  }

  export type EventUncheckedUpdateWithoutNotificationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type TaskCreateManyUserInput = {
    id?: string
    title: string
    deadline?: Date | string | null
    deadline_text?: string | null
    priority?: string | null
    status?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type EventCreateManyUserInput = {
    id?: string
    title: string
    date_time?: Date | string | null
    date_time_text?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type BilanCreateManyUserInput = {
    id?: string
    date?: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    task_id?: string | null
    event_id?: string | null
  }

  export type TaskUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bilanEntries?: BilanEntryUpdateManyWithoutTaskNestedInput
    Notification?: NotificationUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bilanEntries?: BilanEntryUncheckedUpdateManyWithoutTaskNestedInput
    Notification?: NotificationUncheckedUpdateManyWithoutTaskNestedInput
  }

  export type TaskUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline_text?: NullableStringFieldUpdateOperationsInput | string | null
    priority?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Notification?: NotificationUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Notification?: NotificationUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    date_time?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    date_time_text?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BilanUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: BilanEntryUpdateManyWithoutBilanNestedInput
  }

  export type BilanUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    entries?: BilanEntryUncheckedUpdateManyWithoutBilanNestedInput
  }

  export type BilanUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneWithoutNotificationNestedInput
    event?: EventUpdateOneWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    task_id?: NullableStringFieldUpdateOperationsInput | string | null
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    task_id?: NullableStringFieldUpdateOperationsInput | string | null
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BilanEntryCreateManyTaskInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    bilan_id: string
  }

  export type NotificationCreateManyTaskInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user_id: string
    event_id?: string | null
  }

  export type BilanEntryUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bilan?: BilanUpdateOneRequiredWithoutEntriesNestedInput
  }

  export type BilanEntryUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bilan_id?: StringFieldUpdateOperationsInput | string
  }

  export type BilanEntryUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    bilan_id?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    event?: EventUpdateOneWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationUncheckedUpdateManyWithoutTaskInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    event_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationCreateManyEventInput = {
    id?: string
    title: string
    message: string
    type: $Enums.NotificationType
    read?: boolean
    created_at?: Date | string
    user_id: string
    task_id?: string | null
  }

  export type NotificationUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
    task?: TaskUpdateOneWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    task_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationUncheckedUpdateManyWithoutEventInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    type?: EnumNotificationTypeFieldUpdateOperationsInput | $Enums.NotificationType
    read?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    task_id?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BilanEntryCreateManyBilanInput = {
    id?: string
    minutes_spent?: number
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    task_id: string
  }

  export type BilanEntryUpdateWithoutBilanInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    task?: TaskUpdateOneRequiredWithoutBilanEntriesNestedInput
  }

  export type BilanEntryUncheckedUpdateWithoutBilanInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    task_id?: StringFieldUpdateOperationsInput | string
  }

  export type BilanEntryUncheckedUpdateManyWithoutBilanInput = {
    id?: StringFieldUpdateOperationsInput | string
    minutes_spent?: IntFieldUpdateOperationsInput | number
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    task_id?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}