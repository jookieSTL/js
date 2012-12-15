/* SWAP BOX OBJECT */
var SwapBox = function(sb_options)
{
  for(i in sb_options)
  {
    if(sb_options.hasOwnProperty(i))
    {
      switch(i)
      {
        case "id" : this.id = sb_options[i];
        break;

        default : null;
      }
      this.initialize.apply(this, arguments);
    }
  }
}
/* SWAPBOX METHODS */
SwapBox.prototype = {

  version:2.0,

  /* SET UP OBJECT */
  initialize:function()
  {
    var container = document.getElementById(this.id);
    var selects = container.getElementsByTagName("SELECT");
    var buttons = container.getElementsByTagName("BUTTON");

    var sb_objects = {
      selects:["startBox", "endBox"],
      buttons:["addAll", "add", "remove", "removeAll"]
    };
    /* ASSIGN IDS */
    for(i = 0; i < selects.length; i++) selects[i].setAttribute("id", sb_objects.selects[i]);

    for(j = 0; j < buttons.length; j++)
    {
      if(buttons.length == 2)
      {
        buttons[0].setAttribute("id", sb_objects.buttons[1]);
        buttons[1].setAttribute("id", sb_objects.buttons[2]);
      }
      else
      {
        buttons[j].setAttribute("id", sb_objects.buttons[j]);
      }
    }

    for(x = 0; x < buttons.length; x++)
    {
      buttons[x].onclick = this.execute;
    }
  },
  /* SWAPBOX FUNCTIONALITY */
  execute:function()
  {
    var start;
    var end;

    if(this.id == "add" || this.id == "addAll")
    {
      start = document.getElementById("startBox");
      end = document.getElementById("endBox");
    }
    else if(this.id == "remove" || this.id == "removeAll")
    {
      start = document.getElementById("endBox");
      end = document.getElementById("startBox");
    }
    /* ADD SELECTED TO LIST */
    for(i = 0; i < start.options.length; i++)
    {
      if(this.id == "add" || this.id == "remove")
      {
        if(start.options[i].selected)
        {
          end.options[end.length] = new Option(start.options[i].text, start.options[i].value, true, true);
        }
      }
      else if(this.id == "addAll" || this.id == "removeAll")
      {
        end.options[end.length] = new Option(start.options[i].text, start.options[i].value, true, true);
      }
    }
    /* REMOVE SELECTED FROM LIST */
    for(i = (start.options.length-1); i > -1; i--)
    {
      if(this.id == "add" || this.id == "remove")
      {
        if(start.options[i].selected) start.options[i] = null;
      }
      else if(this.id == "addAll" || this.id == "removeAll")
      {
        start.options[i] = null;
      }
    }
  }
}
/* CREATE NEW INSTANCE @PAGE LOAD */