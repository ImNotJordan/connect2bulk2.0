import { type ClientSchema } from '@aws-amplify/backend';
declare const schema: import("@aws-amplify/data-schema").ModelSchema<{
    types: {
        Firm: import("@aws-amplify/data-schema").ModelType<import("@aws-amplify/data-schema-types").SetTypeSubArg<{
            fields: {
                firm_name: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                address: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                city: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                country: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                administrator_email: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                administrator_first_name: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                administrator_last_name: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                state: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                zip: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                firm_type: import("@aws-amplify/data-schema").EnumType<readonly ["Carrier", "Shipper", "Broker", "Other"]>;
                dba: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                dot: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                mc: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                ein: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                phone: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                website: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                insurance_provider: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                policy_number: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                policy_expiry: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                w9_on_file: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<boolean>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Boolean>;
                brand_color: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                notes: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                load_posts: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<number>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Integer>;
                truck_posts: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<number>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Integer>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, "authorization", (Omit<import("@aws-amplify/data-schema").Authorization<"groups", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            withClaimIn: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "withClaimIn">;
        }, "to"> | Omit<import("@aws-amplify/data-schema").Authorization<"private", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
        }, "to">)[]>, "authorization">;
        User: import("@aws-amplify/data-schema").ModelType<import("@aws-amplify/data-schema-types").SetTypeSubArg<{
            fields: {
                first_name: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                last_name: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                email: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                phone: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                role: import("@aws-amplify/data-schema").EnumType<readonly ["SUPER_MANAGER", "MANAGER", "MEMBER", "Manager", "Member", "Admin", "Regular"]>;
                firm_id: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, "authorization", (Omit<import("@aws-amplify/data-schema").Authorization<"groups", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            withClaimIn: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "withClaimIn">;
        }, "to"> | Omit<import("@aws-amplify/data-schema").Authorization<"private", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
        }, "to"> | Omit<import("@aws-amplify/data-schema").Authorization<"owner", "owner", false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            identityClaim: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "identityClaim">;
        }, "to">)[]>, "authorization">;
        Load: import("@aws-amplify/data-schema").ModelType<import("@aws-amplify/data-schema-types").SetTypeSubArg<{
            fields: {
                id: import("@aws-amplify/data-schema").ModelField<string, "required", undefined, import("@aws-amplify/data-schema").ModelFieldType.Id>;
                sent_by: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                load_number: import("@aws-amplify/data-schema").ModelField<string, "required", undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                pickup_date: import("@aws-amplify/data-schema").ModelField<string, "required", undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                delivery_date: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                origin: import("@aws-amplify/data-schema").ModelField<string, "required", undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                destination: import("@aws-amplify/data-schema").ModelField<string, "required", undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                trailer_type: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                equipment_requirement: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                miles: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<number>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Integer>;
                rate: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<number>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Float>;
                frequency: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                comment: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                created_at: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.DateTime>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, "authorization", (Omit<import("@aws-amplify/data-schema").Authorization<"groups", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            withClaimIn: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "withClaimIn">;
        }, "to"> | Omit<import("@aws-amplify/data-schema").Authorization<"private", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
        }, "to"> | Omit<import("@aws-amplify/data-schema").Authorization<"owner", "owner", false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            identityClaim: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "identityClaim">;
        }, "to">)[]>, "authorization">;
        Truck: import("@aws-amplify/data-schema").ModelType<import("@aws-amplify/data-schema-types").SetTypeSubArg<{
            fields: {
                id: import("@aws-amplify/data-schema").ModelField<string, "required", undefined, import("@aws-amplify/data-schema").ModelFieldType.Id>;
                truck_number: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                available_date: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                origin: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                destination_preference: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                trailer_type: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                equipment: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                length_ft: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<number>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Integer>;
                weight_capacity: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<number>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Integer>;
                comment: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                created_at: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.DateTime>;
                owner: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, "authorization", (Omit<import("@aws-amplify/data-schema").Authorization<"groups", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            withClaimIn: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "withClaimIn">;
        }, "to"> | Omit<import("@aws-amplify/data-schema").Authorization<"private", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
        }, "to"> | (import("@aws-amplify/data-schema").Authorization<"owner", "owner", false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            identityClaim: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "identityClaim">;
        }))[]>, "authorization">;
        Team: import("@aws-amplify/data-schema").ModelType<import("@aws-amplify/data-schema-types").SetTypeSubArg<{
            fields: {
                name: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                description: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                manager_id: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                manager_name: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                manager_email: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
                members: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<number>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Integer>;
                created_at: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.DateTime>;
            };
            identifier: import("@aws-amplify/data-schema").ModelDefaultIdentifier;
            secondaryIndexes: [];
            authorization: [];
            disabledOperations: [];
        }, "authorization", (Omit<import("@aws-amplify/data-schema").Authorization<"groups", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            withClaimIn: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "withClaimIn">;
        }, "to"> | Omit<import("@aws-amplify/data-schema").Authorization<"private", undefined, false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
        }, "to"> | Omit<import("@aws-amplify/data-schema").Authorization<"owner", "owner", false> & {
            to: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, operations: ("search" | "list" | "get" | "create" | "update" | "delete" | "read" | "sync" | "listen")[]) => Omit<SELF, "to">;
            identityClaim: <SELF extends import("@aws-amplify/data-schema").Authorization<any, any, any>>(this: SELF, property: string) => Omit<SELF, "identityClaim">;
        }, "to">)[]>, "authorization">;
        sendResetEmail: import("@aws-amplify/data-schema").CustomOperation<import("@aws-amplify/data-schema-types").SetTypeSubArg<import("@aws-amplify/data-schema-types").SetTypeSubArg<import("@aws-amplify/data-schema-types").SetTypeSubArg<{
            arguments: null;
            returnType: null;
            authorization: [];
            typeName: "Mutation";
            handlers: null;
        }, "arguments", {
            to: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
            resetUrl: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
            firstName: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
            lastName: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
        }>, "returnType", import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<boolean>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Boolean>>, "authorization", (import("@aws-amplify/data-schema").Authorization<"groups", undefined, false> | import("@aws-amplify/data-schema").Authorization<"private", undefined, false>)[]>, "authorization" | "arguments" | "returns" | "handler" | "for", "mutationCustomOperation">;
        deleteCognitoUser: import("@aws-amplify/data-schema").CustomOperation<import("@aws-amplify/data-schema-types").SetTypeSubArg<import("@aws-amplify/data-schema-types").SetTypeSubArg<import("@aws-amplify/data-schema-types").SetTypeSubArg<{
            arguments: null;
            returnType: null;
            authorization: [];
            typeName: "Mutation";
            handlers: null;
        }, "arguments", {
            username: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
            userPoolId: import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<string>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.String>;
        }>, "returnType", import("@aws-amplify/data-schema").ModelField<import("@aws-amplify/data-schema").Nullable<boolean>, never, undefined, import("@aws-amplify/data-schema").ModelFieldType.Boolean>>, "authorization", import("@aws-amplify/data-schema").Authorization<"groups", undefined, false>[]>, "authorization" | "arguments" | "returns" | "handler" | "for", "mutationCustomOperation">;
    };
    authorization: [];
    configuration: any;
}, never>;
export type Schema = ClientSchema<typeof schema>;
export declare const data: import("@aws-amplify/plugin-types").ConstructFactory<import("@aws-amplify/graphql-api-construct").AmplifyGraphqlApi>;
export {};
