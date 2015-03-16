DuckieDocs
==========
Free (for personal use) and open-source document manager that semi-automatically encrypts and organizes your files and extracts the text to make the snailmail and important documents you receive over the years but don't want in the could 'googleable' and manageable.

Ideas / prototyping/todo:
=========================

- [ ] require creating a strong password on first login
- [x] database tables: Docs, Tags, DocTags, Companies, DocsCompanies
- [ ] extract text on upload http://git.macropus.org/2011/11/pdftotext/example/, (ocr, tesseract)
- [ ] store files in either default app dir in profile or set a custom location
- [x] store password in memory
- [ ] upload files by dropping anywhere on page
- [ ] create virtual folder structure for tags?
- [x] use nw.js app location to decrypt sqlite database before opening it https://github.com/nwjs/nw.js/wiki/App
- [x] create a hook on app exit that cleans up any temp files, close database and re-encrypt it
- [x] use formly for sexy forms
- [ ] document overview
- [ ] use datagrid connected to CreateReadUpdateDelete.js
- [ ] implement Sqlite fulltext search
- [ ] encrypt files on upload
- [ ] create add metadata gui on upload
- [ ] extract text / ocr on upload

Entities:
=========
- [x] Document : ['ID_Document', 'ID_DocumentType', 'ID_Company', 'name', 'description', 'image', 'filepath', 'isConverted', 'lastAccessed', 'openedCount']
- [x] DocumentMetaData : ['ID_DocumentMeta', 'ID_Document', 'invoiceNumber', 'invoiceDate', 'invoiceTotal', 'invoiceTotalExVat', 'status']
- [x] DocumentTypes : ['ID_DocumentType', 'ID_Document', 'description', 'longdescription']
- [x] DocTag : ['ID_DocTag', 'ID_Document', 'ID_Tag']
- [x] Tag : ['ID_Tag', 'tagname', 'description', 'color']
- [x] CompanyTag : ['ID_CompanyTag', 'ID_Company', 'ID_Tag']
- [x] Company :  ['ID_Company', 'name', 'address', 'zipcode', 'country', 'image', 'url']


