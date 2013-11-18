/*
*
*identifier  Tyep:String  The only identifier 
*options  Type:Object  [optional parameter]
*
*/
Pagination = function(identifier,options){
  this._head = "_pager_"+identifier;
  this._currentCount = 0;//init  
  this._perPage = 10 ;//init    
  this._currentPage = 1;//init  
  this._totalPages = 0;//init  
  this._setOptions(options);
  Session.set(this._head,{
    limit:this._perPage,
    skip:(this._currentPage-1)*this._perPage
  });
  window[this._head+"_pagination"] = this;//save the pager  into window
}

Pagination.prototype.skip = function() {
  return Session.get(this._head);
}

// Getter and setter functions
Pagination.prototype._setOptions = function(options){
  if (options) {
    this.currentPage(options.currentPage);
    this.perPage(options.perPage);
  }
}

Pagination.prototype.currentPage = function(currentPage) {
  if (currentPage){
    if(typeof currentPage !== "number"){
      throw new Error("the currentPage must be a number");
    }
    if(this._totalPages && this._currentPage > this._totalPages){
      throw new Error("currentPage is big than totalPages");
    }
    return this._currentPage = currentPage;
  }
  return this._currentPage;
}

Pagination.prototype.perPage = function(perPage) {
  if (perPage)
    return this._perPage = perPage;
  else
    return this._perPage;
}

Pagination.prototype.totalPages = function(cursorCount) {
  this._currentCount = cursorCount;
  if(!cursorCount){
    return this._totalPages;
  }
  var remainder;
  var perPage = this._perPage;
  remainder = cursorCount / perPage % 1
  if (remainder !== 0){
    return this._totalPages = cursorCount / perPage - remainder + 1;
  }
  return this._totalPages = cursorCount / perPage
}

Pagination.prototype._checkVars = function() {
  if (typeof this._totalPages !== "number")
      throw new Error('Error: Illegal  total pages');
  return true;
}

Pagination.prototype.go = function(currentPage) {
  if (currentPage){
      if(typeof currentPage !== "number"){
        console.warn("the currentPage must be a number");
        return;
      }
      if(this._totalPages && this._currentPage > this._totalPages){
        console.warn("currentPage is big than totalPages");
      }
      this._currentPage = currentPage;
      Session.set(this._head,{
        limit:this._perPage,
        skip:(this._currentPage-1)*this._perPage
      })
    }
}

Pagination.prototype.destroy = function() {
  delete window[this._head+"_pagination"];
  return Session.set(this._head,null);
}

Pagination.prototype.create = function(cursorCount){
  this.totalPages(cursorCount);
  
  if(this._checkVars()){
    var html = this._bootstrap();
    return html;
  }
}

// Style 'bootstrap'
Pagination.prototype._bootstrap = function() {
  var html = "";
  if(!this._currentCount){ //如果总记录为0
    return html = "No thing";
  }
  var data ='data-head="'+this._head+'" onclick="Pagination.goto(this)"';//
  html += '<div class="pagination">' ;
  html += '<ul>';
  html += '<li><a href="#"'+data+' data-page="1">«</a></li>';
  for (var i = 1;i < this._totalPages + 1; i++) {
    if(i !== this._currentPage){
        html += '<li><a href="#" '+data+'data-page="'+i+'">'+i+'</a></li>'
    }else{
      html += '<li class="active"><a href="#" '+data+'data-page="'+i+'">'+i+'</a></li>'
    }
  }
  html += '<li><a href="#" '+data+'data-page="'+this._totalPages+'">»</a></li>';
  html += '</ul>';
  html += '</div>'
  return html;
}

/*
*use it on dom. for example  <a href="#" data-head="page_indentifier" data-page="1" onclick="Pagination.goto(this)"></a>
*/
Object.defineProperty(Pagination,"goto",{
  value:function(item){
      var head = $(item).data("head");
      var page = +$(item).data("page");
      window[head+"_pagination"].go(page);
  }
});

/*
* get a pagination's identifier and delete it from window and Session.
*/
Object.defineProperty(Pagination,"destroy",{
  value:function(identifier){
    var _head = "_pager_"+identifier+"_pagination";
    var pager = window[_head];
    if(pager){
      pager.destroy();
    }else{
      console.warn("the pagination of "+ identifier + " is not exists");
    }
  }
});

/*
*identifier : pagination's
*page: the page what you want to show
*/
Object.defineProperty(Pagination,"go",{
  value:function(identifier,page){
    if(typeof page !== "number" || page <= 0){
      throw new Error("the page must be integer  and can't less 0");
    }
    var _head = "_pager_"+identifier;
    var pager = window[_head+"_pagination"]
    if(pager){
      pager.go(page)
    }else{
      console.warn("the pagination of "+ identifier + " is not exists");
    }
  }
});