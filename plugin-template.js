
export default class SolidYOURBACKENDStorage {

  /**
   * file system backend for Solid-Rest
   * @constructor
   * @return {prefix:"file",name:"solid-rest-file-version"}
   */
  constructor() {
    this.prefix = "YOUR PROTOCOL PREFIX"
    this.name = "solid-rest-YOUR_PROTOCOL_PREFIX-YOUR-VERSION"
  }

  /**
   * check if file exists
   * @param filePath
   * @return {boolean}
   */
  async  itemExists(path){
  }

  /**
   * check if thing is Container or Resource
   * @param filePath
   * @return "Container" | "Resource" | null
   */
  async  itemType(path,wantFull){
  }

  /**
   * examine a requested item
   * @param filePath, request object
   * @return item object
   * item = {
   *   mode : { read:1,append:1,write:1,control:1 }
   *   exists : await this.itemExists(),
   *   isContainer : await this.getType()==="Container" ? true : false,
   * }
   * Note : mode is optional, only provide if you can check permissions
   */
  async  getItemInfo(fn,request){
  }

  /**
   * read a file
   * @param filePath
   * @return on success : body | Response object
   * @return on failure false  | Response object
   */
  async getResource(pathname){
    let bodyData;
    try {
      bodyData = await // ...
    }
    catch(e) { return false }
    return bodyData 
  }

  /**
   * write a file
   * @param filePath, content
   * @return true | Response object on success
   * @return false | Response object on failure
   */
  async putResource(pathname,content){
    let successCode = true;
    let failureCode = false;
    return new Promise(async (resolve) => {
        let writeIt=false
        if(typeof content==="undefined") content = ""
        if(typeof content==="string"){
          writeIt=true
        }
        else if(content.stream){
            content = await content.stream()
            content = await content.read()
            writeIt=true
        }
        else if(content.text){
            content = await content.text()
            writeIt=true
        }
        if(writeIt){
            try {
                await fs.writeFileSync(pathname,content)
                return resolve(successCode)
            }
            catch(e){ console.log(e); return resolve(failureCode)}
        }
        if(!content.pipe && typeof FileReader !="undefined"){
            var fileReader = new FileReader();
            fileReader.onload = function() {
                fs.writeFileSync(pathname, Buffer.from(
                     new Uint8Array(this.result))
                )
            }
            fileReader.onloadend = () => {
              return resolve(successCode)
            }
            fileReader.onerror = (err) => {
                console.log(err);
                return resolve(failureCode)
            }
            fileReader.readAsArrayBuffer(content);
        }
        else {
            content = content || ""
            content = this._makeStream( content );
            content.pipe(fs.createWriteStream(pathname)).on('finish',()=>{
                return resolve( successCode )
            }).on('error', (err) => {
                console.log(err)
                return resolve( failureCode )
            })
        }
    })
  }

  /**
   * delete file
   * @param filePath
   * @return true on success, false on failure
   */
  async deleteResource(fn){
    return new Promise(function(resolve) {
      fs.unlink( fn, function(err) {
        if(err)  resolve( false );
        else     resolve( true );
      });
    });
  }

  /**
   * delete folder
   * @param filePath
   * @return true on success, false on failure
   */
  deleteContainer(fn) {
    return new Promise(async function(resolve) {
        await fs.rmdir( fn, function(err) {
            if(err) {
                resolve( false );
            } else {
                resolve( true );
            }
        });
    });
  }

  /**
   * create folder
   * @param filePath
   * @return true on success, false on failure
   */
  async postContainer(fn){
    fn = fn.replace(/\/$/,'');
    return new Promise(function(resolve) {
      if(fs.existsSync(fn)){
        return resolve( true )
      }
      fs.mkdirp( fn, {}, (err) => {
        if(err) {
          return resolve( false )
        } 
        else {
          return resolve( true )
        }
      });
    });
  }

  /**
   * create parent and intermediate folders
   * @param filePath
   * @return true on success, false on failure
   */
  async makeContainers(pathname){
    const foldername = libPath.dirname(pathname)
    if (!fs.existsSync(foldername)) {
      try {
        fs.mkdirpSync(foldername);
        return Promise.resolve(true)
      }
      catch {
        return Promise.resolve(false)
      }
    }
    return Promise.resolve(true)
  }

  /**
   * read a folder
   * @param filePath
   * @return on success : a possibly empty array of child fileNames (not paths)
   * @return on failure : false
   */
  async getContainer(pathname) {
    let files
    try {
      files = await fs.readdirSync(pathname)
    }
    catch(e) { return false  }
    return files;
  }


  /**
   * creates a ReadableStream
   * @param content as text or streamable object
   * @return on success : a ReadableStream
   * @return on failure : false
   */
  _makeStream(text){
    if (typeof text === 'object' && typeof text.stream === 'function') {
      return text.stream()
    }
       let s = new Readable
       s.push(text)
       s.push(null)  
       return s;
   }

} // end of SolidRestFile

  /**
   * return parent url with / at the end.
   * If no parent exists return null
   * @param {string} url 
   * @returns {string|null}
  */
  function getParent(url) {
    while (url.endsWith('/'))
      url = url.slice(0, -1)
    if (!url.includes('/'))
      return null
    return url.substring(0, url.lastIndexOf('/')) + '/'
  }

// ENDS


