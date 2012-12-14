/* LANGUAGES LINKS */
var Languages = function(options)
{
  for(i in options)
  {
    if(options.hasOwnProperty(i))
    {
      switch(i)
      {
        case "url" : this.url = options[i];
        break;
        
        case "id" : this.id = options[i];
        break;
      }
    }
  }
  this.build.apply(this, arguments);
}
Languages.prototype = {

  build:function()
  {
    var li;
    var _this = this;
    var navigation = $("#"+_this.id);

    $.ajax({
      url:_this.url,
      dataType:"json",
      type:"get",
      success:function(data)
      {
        var json = data;
        var ol = $("<ol>",{
          "class":"langnavi"
        });
        $.each(json.locales, function(i, country)
        {
          if(country.code == currentLocale) li = $("<li>").text(country.name).attr("class", "selected");
          else
          {
            li = $("<li>").append($("<a>",
            {
              "text":country.name,
              "href":country.url,
              "title":country.name
            }));
          }
          ol.append(li);
        });
        navigation.prepend(ol);
      }
    });
  }
}