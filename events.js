/* ADD EVENTS TO OBJECTS */
var addEvent;

if(document.addEventListener)
{
  addEvent = function(obj, type, fn)
  {
    obj.addEventListener(type, fn, false);
  }
}
else if(document.attachEvent)
{
  addEvent = function(obj, type, fn)
  {
    obj["e" + type + fn] = fn;
    obj[type + fn] = function()
    {
      obj["e" + type + fn](window.event);
    }
    obj.attachEvent("on" + type, obj[type + fn]);
  }
}
else
{
  addEvent = null;
}
/* REMOVE EVENTS FROM OBJECTS */
var removeEvent;

if(document.removeEventListener)
{
  removeEvent = function(obj, type, fn)
  {
    obj.removeEventListener(type, fn, false);
  }
}
else if(document.detachEvent)
{
  removeEvent = function(obj, type, fn)
  {
    obj["e" + type + fn] = fn;
    obj[type + fn] = function()
    {
      obj["e" + type + fn](window.event);
    }
    obj.detachEvent("on" + type, obj[type + fn]);
  }
}
else
{
  removeEvent = null;
}