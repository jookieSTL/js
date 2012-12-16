/* FOOTER */
var Footer = function(options)
{
  for(i in options)
  {
    if(options.hasOwnProperty(i))
    {
      switch(i)
      {
        case "url" : this.url = options[i];
        break;

        case "labels" : this.labels = options[i];
        break;
      }
    }
  }
  this.url = appendCustomerNumberSuffix(this.url);
  this.footer = $("footer");
  this.build.apply(this, arguments);
}
Footer.prototype = {

  build:function()
  {
    var _this = this;
    
    $.ajax({
      url:_this.url,
      dataType:"html",
      beforeSend:function()
      {
        _this.footer.addClass("loading");
      },
      success:function(html)
      {
        _this.footer.removeClass("loading").append(html);

        if (typeof aReady !== 'undefined') {
        	aReady(null,true);
        }
        if (typeof showHide !== 'undefined') {
        	showHide();
        }        
      }
    });
  }
}