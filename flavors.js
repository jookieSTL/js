/* GET FLAVORS */
$(function()
{
  $.ajax({
    url:"./include/flavors.json",
    dataType:"json",
    type:"get",
    success:function(data)
    {
      $.each(data.flavors, function(i, flv)
      {
        var a = $("<a>", {
            href:("./flavor-details.php?f=" + flv.type)
          }).append($("<img>", {
            src:"./images/" + flv.image,
            alt:flv.name,
            border:0
          }
        )).append($("<em>").html(flv.name));

        switch(flv.group)
        {
          case "specialty" : $("#specialty").append(a);
          break;

          case "beta" : $("#beta").append(a);
          break;

          default : $("#signature").append(a);
        }
      });      
    }
  })
});