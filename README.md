
IIGB Search Updater
=====================

### About this application

This application is written using the [Node.js](https://nodejs.org/en/) JavaScript runtime. 

This utility application can drop, populate, and refresh indexed data held in [AWS Cloudsearch](https://aws.amazon.com/cloudsearch/).

### Prerequisites

In order to run the tool locally in development you'll need the following :

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/downloads) 
- [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html#install-bundle-other-os)

Environment Variables Set for:

- AWS_CS_SEARCH;
- AWS_CS_UPLOAD;
- AWS_ACCESS_KEY_ID;
- AWS_SECRET_ACCESS_KEY;


You'll need both search permission and document upload permission.

### Getting Started

Run the following from the command line to download the repository and change into the directory:

```
git clone git@github.com:uktrade/iigb-beta-search-updater.git

cd iigb-beta-search-updater
```

### Running the application


To find the latest version of data, add the newest data from the build directory, then remove the previous versions updating the search index.:

```bash
node refreshSearch.js iigb-beta-website/build/
```

To drop the data from an index:

```bash
node dropSearch.js iigb-beta-website/build/ 
```

To populate an empty index. To be used after dropping an index:

```bash
node populateSearch.js iigb-beta-website/build/ 
```
