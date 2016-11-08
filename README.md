
IIGB Search Updater
=====================

### About this application

This application is written using the [Node.js](https://nodejs.org/en/) JavaScript runtime. 

This utility application can drop, populate, and refresh indexed data held in [AWS Cloudsearch](https://aws.amazon.com/cloudsearch/).

### Prerequisites

In order to run the tool locally in development you'll need the following :

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/downloads) 

Environment Variables Set for:

- AWS_ACCESS_KEY_ID_IIGB_SEARCH;
- AWS_SECRET_ACCESS_KEY_IIGB_SEARCH;
- AWS_CS_SEARCH_CN;
- AWS_CS_UPLOAD_CN;
- AWS_CS_SEARCH_DE;
- AWS_CS_UPLOAD_DE;
- AWS_CS_SEARCH_US;
- AWS_CS_UPLOAD_US;


You'll need both search permission and document upload permission.

### Getting Started

Run the following from the command line to download the repository and change into the directory:

```
git clone git@github.com:uktrade/iigb-beta-search-updater.git

cd iigb-beta-search-updater
```

### Running the application


To find the latest version of data, add the newest data from the build directory, then remove the previous version updating the search index.:

```bash
node refreshSearch.js path/to/build/folder us,cn,de
```

To drop the data from the index:

```bash
node dropSearch.js path/to/build/folder us,cn,de
```

To populate an index. To be used after dropping an index:

```bash
node populateSearch.js path/to/build/folder us,cn,de
```

NB If any country code is omitted from the comma separated list at the end of these commands, that index will not be changed.

