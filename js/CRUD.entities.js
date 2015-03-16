/**
 * These are the entity mappings (ActiveRecord / ORM objects) for DuckieDocs.
 * There's an object for each database table where information is stored.
 * These are all based on CreateReadUpdateDelete.js : http://schizoduckie.github.io/CreateReadUpdateDelete.js
 * CRUD.JS creates automatic SQL queries from these objects and handles relationships between them.
 * It also provides the automatic execution of the create statements when a database table is not available.
 */


var Document = CRUD.define({
    className: 'Document',
    table: 'Documents',
    primary: 'ID_Document',
    fields: ['ID_Document', 'ID_DocumentType', 'ID_Company', 'name', 'description', 'image', 'filepath', 'isConverted', 'lastAccessed', 'openedCount'],
    relations: {
        'Company': CRUD.RELATION_FOREIGN,
        'Tag': CRUD.RELATION_MANY
    },
    indexes: [
        'name'
    ],

    createStatement: 'CREATE TABLE "Documents" ("ID_Document" INTEGER PRIMARY KEY NOT NULL, "ID_DocumentType" INTEGER NULL, "ID_Company" INTEGER DEFAULT NULL, "name" varchar(255), "description" TEXT NULL, "image" VARCHAR(1024) NULL, "filepath" VARCHAR(1024) null, "isConverted" INTEGER(1) default 0, "lastAccessed" TIMESTAMP NULL, "openedCount" INTEGER DEFAULT 0 )',
    adapter: 'dbAdapter',
    defaultValues: {

    },
    fixtures: [

    ],
    migrations: {

    }

}, {

});

var DocumentMetaData = CRUD.define({
    className: 'DocumentMetaData',
    table: 'DocumentMetaData',
    primary: 'ID_DocumentMeta',
    fields: ['ID_DocumentMeta', 'ID_Document', 'invoiceNumber', 'invoiceDate', 'invoiceTotal', 'invoiceTotalExVat', 'status'],
    relations: {
        'Document': CRUD.RELATION_FOREIGN,
    },
    indexes: [
        'ID_Document',
        'status',
        'invoiceNumber'
    ],

    createStatement: 'CREATE TABLE "DocumentMetaData" ("ID_Document" INTEGER PRIMARY KEY NOT NULL, "invoiceNumber" varchar (1024) default NULL, "invoiceDate" TIMESTAMP DEFAULT NULL, "invoiceTotal" DECIMAL(10, 2), "invoiceTotalExVat" DECIMAL(10, 2), "status" VARCHAR(255))',
    adapter: 'dbAdapter',
    defaultValues: {

    },
    fixtures: [

    ],
    migrations: {

    }

}, {

});

var DocumentTypes = CRUD.define({
    className: 'DocumentTypes',
    table: 'DocumentTypes',
    primary: 'ID_DocumentType',
    fields: ['ID_DocumentType', 'ID_Document', 'description', 'longdescription'],
    relations: {
        'Document': CRUD.RELATION_FOREIGN,
    },
    indexes: [
        'ID_Document'
    ],

    createStatement: 'CREATE TABLE "DocumentTypes" ("ID_DocumentType" INTEGER PRIMARY KEY NOT NULL, "ID_Document" INTEGER NOT NULL, "description" VARCHAR(1024) null, "longdescription" TEXT NULL)',
    adapter: 'dbAdapter',
    defaultValues: {

    },
    fixtures: [

    ],
    migrations: {

    }

}, {

});



var DocTag = CRUD.define({

    className: 'DocTag',
    table: 'documents_tags',
    primary: 'ID_DocTag',
    fields: ['ID_DocTag', 'ID_Document', 'ID_Tag'],
    relations: {
        'Document': CRUD.RELATION_FOREIGN,
        'Tag': CRUD.RELATION_FOREIGN
    },
    indexes: [
        'ID_Document, ID_Tag'
    ],
    createStatement: 'CREATE TABLE "documents_tags" ("ID_DocTag" INTEGER PRIMARY KEY NOT NULL, "ID_Document" INTEGER NOT NULL, "ID_Tag" INTEGER NOT NULL)'

})

var Tag = CRUD.define({
    className: 'Tag',
    table: 'Tags',
    primary: 'ID_Tag',
    fields: ['ID_Tag', 'tagname', 'description', 'color'],
    relations: {
        'Document': CRUD.RELATION_MANY,
        'Company': CRUD.RELATION_MANY
    },
    indexes: [
        'tagname'
    ],
    orderProperty: 'tagname',
    orderDirection: 'DESC',
    createStatement: 'CREATE TABLE "Tags" ("ID_Tag" INTEGER PRIMARY KEY NOT NULL, tagname varchar(250), description Text NULL, color varchar(50) )',
    adapter: 'dbAdapter',
    defaultValues: {},

});

var CompanyTag = CRUD.define({

    className: 'CompanyTag',
    table: 'companies_tags',
    primary: 'ID_CompanyTag',
    fields: ['ID_CompanyTag', 'ID_Company', 'ID_Tag'],
    relations: {
        'Company': CRUD.RELATION_FOREIGN,
        'Tag': CRUD.RELATION_FOREIGN
    },
    indexes: [
        'ID_Company, ID_Tag'
    ],
    createStatement: 'CREATE TABLE "companies_tags" ("ID_CompanyTag" INTEGER PRIMARY KEY NOT NULL, "ID_Company" INTEGER NOT NULL, "ID_Tag" INTEGER NOT NULL)'
})

var Company = CRUD.define({
    className: 'Company',
    table: 'Companies',
    primary: 'ID_Company',
    fields: ['ID_Company', 'name', 'address', 'zipcode', 'country', 'image', 'url'],

    autoSerialize: [],
    relations: {
        'Document': CRUD.RELATION_MANY,
        'Tag': CRUD.RELATION_MANY
    },
    createStatement: 'CREATE TABLE "Companies" ("ID_Company" INTEGER PRIMARY KEY NOT NULL, "name" varchar(255) ,"address" varchar(255),"zipcode" varchar(10), "city" varchar(100) ,"country" varchar(50),"image" varchar(255) ,"url" varchar(1024) )',
    adapter: 'dbAdapter',
    defaultValues: {

    },
    indexes: [

    ],
    fixtures: [

    ],
})



CRUD.DEBUG = true;