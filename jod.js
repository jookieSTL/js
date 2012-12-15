/* JAVASCRIPT ON DEMAND */
var jod = function(file)
{
  var loadedFile;

  head = document.getElementsByTagName("HEAD")[0];
  f = file.split(".");
  element_id = ("jod_" + f[0]);

  /* CREATE CSS FILE*/
  var css = document.createElement("LINK");

  css.type = "text/css";
  css.rel = "stylesheet";
  css.href = ("./include/" + file)

  /* CREATE JS FILE */
  var js = document.createElement("SCRIPT");

  js.type = "text/javascript";
  js.src = ("./include/" + file);

  css.id = js.id = (element_id + "_" + f[1]);

  var tmp_id = css.id = js.id;

  /* DETERMINE FILE TYPE */
  switch(f[1])
  {
    case "css" : loadedFile = css;
    break;

    case "js" : loadedFile = js;
    break;

    default : null;
  }

  /* DETERMINE WHETHER FILE IS ALREADY LOADED */
  (!document.getElementById(tmp_id)) ? head.appendChild(loadedFile) : null;
}
