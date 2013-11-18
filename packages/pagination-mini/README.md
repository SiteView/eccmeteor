Meteor Pagination-mini
==============================================
The project github:https://github.com/huyinghuan/meteor-pagination-mini.git.

The project come from https://github.com/airlok/meteor-pagination cloning.

Thanks for @airlok .

#### this package is  depends jquery and bootstrap

So when you create a meteor application .make sure:

```shell
meteor add jquery
meteor add bootstrap
```

This enables simple pagination in your Meteor app. There are two key parts:

   Limiting cursor results to only what should be displayed on the current page.
   Displaying page links at the bottom, the styles just for bootstrap.

### Basics

Displaying only the current page's cursor results is easy. This will enable you to insert just those results into each page, and it automatically changes when the page changes. 

### Installation
  There is a easy way to get pagination-mini.
  pagination-mini can be installed with [Meteorite](https://github.com/oortcloud/meteorite/). From inside a Meteorite-managed app:

```js
  mrt add pagination-mini
```

  Maybe you don't want to use meteorite,there is other way.
  You can download [the project](https://github.com/huyinghuan/meteor-pagination-mini/archive/v0.0.2.zip) then uzip and cp them into your meteor application's "packages" folder.
  just like this :(please uzip it at first)

```shell
meteor create helloworld
cd helloworld
mkdir packages
cp /home/meteor-pagination-mini /home/helloworld/packages/pagination-mini
```
  and then you should edit the helloworld/.meteor/packages  (maybe .meteor is a hidden folder) and add "pagination-mini" at last line.
  at last ,the packages file like this:

```
# Meteor packages used by this project, one per line.
#
# 'meteor add' and 'meteor remove' will edit this file for you,
# but you can also edit it by hand.

standard-app-packages
autopublish
insecure
preserve-inputs
pagination-mini
bootstrap
```

### Getting Started

```html
<Template name="test">
  {{#each people}}
    {{name}}:{{age}}
  {{/each}}
  {{{pager}}}
</Template>
```


```js
var page = new Pagination("myfirstPagination");

Template.test.people = function(){
  return People.find({},page.skip());
}

Template.test.pager = function(){  //Note : pager was  surrounded by three '{}'. example {{{pager}}} 
  return page.create(People.find().count());
}

Template.test.destroyed = function(){
  page.destroy();
}
```
if you want to get a demo , see [it](https://github.com/huyinghuan/pagination-mini-test)

## API

It's important to note that arguments of Pagination Construction is id  of pagination dom;and there are two paramters

### Pagination Construction

```js
/*
*
*identifier  Tyep:String
      the pagination' identifier .Be sure it's only.Relying on it distinguish different pagination if there are two or more {{{pager}}} on the same Template. 
*options  Type:Object  [optional parameter]
*    perPage :Set the number of results you want to display per page.  default 1
*    currentPage:Set the current page . default 10
*    e.g {currentPage: 1,perPage:10}  
*/
Pagination = function(identifier,options){}
```
### go
Set the number of results you want to display per page by not auto. 
you can do it use Pagination's instance.
```js
  page.go(2);
```
or call Pagination.go by Pagination's identifier

```js
  Pagination.go("myfirstPagination",2);
```

*Pagination.go(identifier,page)
  *identifier : pagination's
  *page: the page what you want to show

### destroy
  *you had better destroy Pagination when your Template destroy. because the some date about pagination keep in memory.
  *for example:
```js
Template.test.destroyed = function(){
  page.destroy();
}
```
or call Pagination.destroy by Pagination's identifier

```js
  Pagination.destroy("myfirstPagination");
```

### skip
you just only use it on Collection; the skip tell the Collection how to show the data by  paging.

```js
  Template.test.people = function(){
    return People.find({},page.skip());
  }
```

## create

create the Pagination on html

you only do it like this:

```html
<Template name="test">
  {{{pager}}}
</Template>
```

```js
Template.test.pager = function(){
  return page.create(People.find().count());
}
```


### The result 
  
  result work with [Bootstrap pagination](http://twitter.github.com/bootstrap/components.html#pagination) 

    ```html
    <div class="pagination">
      <ul>
        <li><a href="#">«</a></li>
        <li><a href="#">1</a></li>
        <li><a href="#" class="active">2</a></li>
        <li><a href="#">3</a></li>
        <li><a href="#">4</a></li>
        <li><a href="#">»</a></li>
      </ul>
    </div>