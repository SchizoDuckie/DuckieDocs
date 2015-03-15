ideas / prototyping:
====================

- require creating a strong password on first login
- database tables: Docs, Tags, DocTags, Companies, DocsCompanies
- extract text on upload http://git.macropus.org/2011/11/pdftotext/example/, (ocr, tesseract)
- store files in either default app dir in profile or set a custom location
- store password in memory
- upload files by dropping anywhere on page
- create folder structure for tags?
- 

Docs:
- Id, title, size, created, lastaccessed, content, custompassword (optional), DocType

Invoices:
- Id, ID_Company, ID_Document, metadata like total, inc vat, ex vat, account number,

DocumentMetaData:
- ID, Type,

Companies:
- Id, name, image, address, contact

Users:
- Id, username, image, firstname, lastname, lastlogin



- use nw.js app location to decrypt sqlite database before opening it https://github.com/nwjs/nw.js/wiki/App

- create a hook on app exit that cleans up any temp files, close database and re-encrypt it

- use formly for sexy forms