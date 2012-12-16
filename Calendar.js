/* DATE OBJECT */
var now = new Date();
var get_date = now.getUTCDate();
var get_year = now.getUTCFullYear();
var get_month = now.getUTCMonth();
var counter = get_month;

/* GET NUMBER OF DAYS IN MONTH */
Date.prototype.daysInMonth = function()
{
  return new Date(this.getUTCFullYear(), this.getUTCMonth() + 1, 0).getUTCDate()
}

/* CALENDAR OBJECT */
var Calendar = function(calendar_options)
{
  if(document.getElementById)
  {
    for(i in calendar_options)
    {
      if(calendar_options.hasOwnProperty(i))
      {
        switch(i)
        {
          case "id" : this.id = calendar_options[i];
          break;

          case "language" : this.language = calendar_options[i].substr(0, 2); // version 1.0 support
          break;

          case "format" : this.format = calendar_options[i];
          break;

          case "localization" : this.localization = calendar_options[i];
          break;

          case "datepicker" : this.datepicker = calendar_options[i];
          break;

          case "form_id" : this.datepicker = calendar_options[i]; // version 1.0 support
          break;

          case "startdate" : this.startdate = calendar_options[i];
          break;

          case "enddate" : this.enddate = calendar_options[i];
          break;

          case "popup" : this.popup = calendar_options[i];
          break;

          default : null;
        }
      }
    }
    this.setup.apply(this, arguments);
  }
}

Calendar.prototype = {

  /* CURRENT VERSION */
  version:2.0,

  /* LANGUAGE CONTENT */
  LangData:{
   months:
    {
      english:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      francais:["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
      deutsch:["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
      espanol:["Enero", "Febrero", "Marcha", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    },

    days:
    {
      english:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      francais:["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
      deutsch:["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
      espanol:["Domingo",  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    },

    _close:
    {
      english:"Close",
      francais:"Fermer",
      deutsch:"nahes Fenster",
      espanol:"Cerrar"
    }
  },

  /* JAVASCRIPT ON DEMAND */
  jod:function(file)
  {
    var loaded_file;
    var head = document.getElementsByTagName("HEAD")[0];
    var f = file.split(".");
    var _id = ("jod_" + f[0]);

    /* CREATE CSS FILE*/
    if(f[1] == "css")
    {
      loaded_file = document.createElement("LINK");
      loaded_file.type = "text/css";
      loaded_file.rel = "stylesheet";
      loaded_file.href = ("./include/" + file);
    }

    /* CREATE JS FILE */
    if(f[1] == "js")
    {
      loaded_file = document.createElement("SCRIPT");
      loaded_file.type = "text/javascript";
      loaded_file.src = ("./include/" + file);
    }

    loaded_file.id = (_id + "_" + f[1]);

    /* DETERMINE WHETHER FILE IS ALREADY LOADED */
    (!document.getElementById(loaded_file.id)) ? head.appendChild(loaded_file) : null  
  },

  /* SET UP THE CALENDAR VARIABLES */
  setup:function()
  {
    this.jod("calendar.css");

    /* EMPTY MONTHS/DAYS OF WEEK ARRAYS/VARIABLES */
    var theMonths = [];
    var theWeekDays = [];
    var month_loop, day_loop;

    var dataMonths = this.LangData.months;
    var dataDays = this.LangData.days;

    /* CHECK FOR META TAGS */
    var _head = document.getElementsByTagName("HEAD")[0];
    var meta = _head.getElementsByTagName("META");

    if(meta.length >=1 ) this.meta_data();

    /* POPULATE MONTHS/DAYS OF WEEK BASED ON LANGUAGE */
    switch(this.language)
    {
      case "fr" : ((month_loop = dataMonths.francais) && (day_loop = dataDays.francais));
      break;

      case "de" : ((month_loop = dataMonths.deutsch) && (day_loop = dataDays.deutsch));
      break;

      case "es" : ((month_loop = dataMonths.espanol) && (day_loop = dataDays.espanol));
      break;

      default : ((month_loop = dataMonths.english) && (day_loop = dataDays.english));
    }

    for(i=0; i < month_loop.length; i++) theMonths.push(month_loop[i]);

    /* REFORMAT DAYS OF WEEK HEADERS */
    for(i=0; i < day_loop.length; i++)
    {
      switch(this.format)
      {
        case "single" : theWeekDays.push(day_loop[i].substring(0, 1));
        break;

        case "short" : theWeekDays.push(day_loop[i].substring(0, 2));
        break;

        default :  theWeekDays.push(day_loop[i]);
      }
    }

    /* EUROPEAN CALENDAR FORMAT */
    if(this.localization === "euro")
    {
      var euro = theWeekDays.shift();
      theWeekDays.push(euro);
    }

    this.build(theMonths, theWeekDays);
  },

  /* BUILD THE CALENDAR */
  build:function(theMonths, theWeekDays)
  {
    /* RESET COUNTER FOR END/BEGINNING OF YEAR */
    if(get_month == 12) get_month = 0;
    if(get_month < 0) get_month = 11;

    /* COUNTER FIX - GO TO NEXT YEAR */
    if(counter > 11)
    {
      counter = 0;
      get_year++
    }

    /* COUNTER FIX - GO TO PREVIOUS YEAR */
    if(counter < 0)
    {
      counter = 11;
      get_year--
    }

    /* GET THE CURRENT DATE */
    var current = new Date();
    var current_month = current.getUTCMonth();
    var current_year = current.getUTCFullYear();

    /* TRACK THE NUMBER OF DAYS IN EACH MONTH */
    var num_days = [31, ((get_year % 4 == 0 && get_year % 100 != 0) || get_year % 400 == 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    /* FIND THE DAY OF THE WEEK WHERE THE MONTH STARTS */
    var first;

    (this.localization == "euro") ? first = new Date(get_year, get_month, 0) : first = new Date(get_year, get_month, 1);

    var f = first.getDay();
    var how_many = ((num_days[get_month] - 1) + first.daysInMonth());

    /* CALENDAR CONTAINER */
    var container = document.getElementById(this.id);
    container.innerHTML = "";

    /* TABLE OBJECT */
    var table = document.createElement("TABLE");
    table.className = "calendar";

    var caption = document.createElement("CAPTION");
    var thead = document.createElement("THEAD");
    var tbody = document.createElement("TBODY");
    var tr = document.createElement("TR");
    var th = document.createElement("TH");
    var td = document.createElement("TD");

    /* CAPTION - CREATE CALENDAR NAVIGATION */
    var _this = this;
    var dl = document.createElement("DL");
    dl.className = "calendarNavigation";

    /* DATE PICKER NAVIGATION OPTION */
    if(this.datepicker)
    {
      /* PREVIOUS MONTH LINK */
      var dd = document.createElement("DD");
      var a = document.createElement("A");

      a.innerHTML = "&lt;";
      a.href = "#";
      a.title = "Previous Month";

      /* NAVIGATE TO PREVIOUS MONTH */
      a.onclick = function()
      {
        get_month = (get_month - 1);
        counter--

        _this.build(theMonths, theWeekDays);
        
        return false;
      }

      dd.className += " previousMonth";
      var prevmonth = dd.appendChild(a);
      dl.appendChild(dd);

      /* NEXT MONTH LINK */
      var dd = document.createElement("DD");
      var a = document.createElement("A");

      a.innerHTML = "&gt;";
      a.href = "#";
      a.title = "Next Month";

      /* NAVIGATE TO NEXT MONTH */
      a.onclick = function()
      {
        get_month = (get_month + 1);
        counter++

        _this.build(theMonths, theWeekDays);
        return false;
      }

      dd.className += " nextMonth";
      var nextmonth = dd.appendChild(a);
      dl.appendChild(dd);
    }

    /* CURRENT MONTH/YEAR HEADER */
    var dt = document.createElement("DT");

    dt.innerHTML = (theMonths[get_month] + "&nbsp;" + get_year);
    dl.appendChild(dt);
    caption.appendChild(dl)

    /* THEAD - CREATE DAYS OF THE WEEK LABELS */
    for(i=0; i < theWeekDays.length; i++)
    {
      th.innerHTML = theWeekDays[i];
      tr.appendChild(th.cloneNode(true));
    }
    thead.appendChild(tr);

    /* TBODY - CREATE CALENDAR DATES */
    var a = document.createElement("A");
    a.href = "#";

    var now = new Date(); // create a date object to keep track of the date being created

    for(i=0; i < 42; i++)
    {
      (i % 7 == 0) ? tr = document.createElement("TR") : null;

      if((i < f) || (i > how_many)) td.innerHTML = "&nbsp;";
      else
      {
        if(this.startdate && this.enddate)
        {
          /* TRACK DATE RANGE */
          now.setFullYear(get_year, get_month, (i - f + 1));

          /* GET START DATE */
          var start_tmp = this.startdate.split("/");
          var start_month = Number(start_tmp[0] - 1);
          var start_date = Number(start_tmp[1] -1);
          var start_year = Number(start_tmp[2]);
          var start = new Date();

          /* GET END DATE */
          var end_tmp = this.enddate.split("/");
          var end_month = Number(end_tmp[0] - 1);
          var end_date = Number(end_tmp[1]);
          var end_year = Number(end_tmp[2]);
          var end = new Date();
  
          /* ADD TO DATE */
          var plusMonth = (end_month - now.getUTCMonth());
          var plusDate = (end_date - now.getUTCDate());
          var plusYear = (end_year - now.getUTCFullYear());

          /* SUBTRACT FROM DATE */
          var minusMonth = (now.getUTCMonth() - start_month);
          var minusDate = (now.getUTCDate() - start_date);
          var minusYear = (now.getUTCFullYear() - start_year);

          /* CONVERT START DATE TO DATE FORMAT */
          start.setMonth(now.getUTCMonth() - minusMonth);
          start.setDate(now.getUTCDate() - minusDate);
          start.setYear(now.getUTCFullYear() - minusYear);

          /* CONVERT END DATE TO DATE FORMAT */
          end.setMonth(now.getUTCMonth() + plusMonth);
          end.setDate(now.getUTCDate() + plusDate);
          end.setYear(now.getUTCFullYear() + plusYear);
        }

        td.innerHTML = "";

        var withinBounds = true;

        /* HIDE MONTH NAVIGATION IF OUT OF BOUNDS */
        if(now < start)
        {
          if(prevmonth) prevmonth.style.visibility = "hidden";
          withinBounds = false;
        }

        if(now > end)
        {
          if(nextmonth) nextmonth.style.visibility = "hidden";
          withinBounds = false;
        }

        /* ENABLED DATE PICKER */
        if(this.datepicker && withinBounds)
        {
          a.innerHTML = (i - f + 1);

          if(this.localization == "euro") a.title = ((i - f + 1) + "/" + (get_month + 1) + "/" + get_year);
          else
          {
            a.title = ((get_month + 1) + "/" + (i - f + 1) + "/" + get_year);
          }
          td.appendChild(a);
        }
        else
        {
          td.innerHTML = (i - f + 1);
        }        
      }

      /* TRACK CURRENT DATE */
      if((current_month == get_month) && (current_year == get_year))
      {
        (get_date == (i - f + 1)) ?  td.className += " currentDate" : td.className = ""; // Highlight the Current Day
      }

      tr.appendChild(td.cloneNode(true));
      tbody.appendChild(tr);
    }

    /* ADD CLOSE WINDOW LINK */
    if(this.popup)
    {
      var tfoot = document.createElement("TFOOT");
      var tr = document.createElement("TR");
      var td = document.createElement("TD");
      var a = document.createElement("A");
      var close_data;
      var _this = this;

      switch(this.language)
      {
        case "fr" : close_data = this.LangData._close.francais;
        break;

        case "de" : close_data = this.LangData._close.deutsch;
        break;

        case "es" : close_data = this.LangData._close.espanol;
        break;
        
        default : close_data = this.LangData._close.english;
      }

      a.href = "#";
      a.innerHTML = a.title = close_data;
      a.onclick = function()
      {
        container.style.display = "none";

        /*@cc_on
        
        if(@_jscript_version <= 5.6)
        {
          var iframe = document.getElementById("ie_mask");
  
          if(iframe) container.removeChild(iframe);
        }

        @*/

        return false;
      }

      td.appendChild(a);
      td.setAttribute("colSpan", 7);
      tr.appendChild(td);
      tfoot.appendChild(tr);
    }

    var _components;

    (this.popup) ? _components = [caption, thead, tfoot, tbody] : _components = [caption, thead, tbody];

    for(i=0; i < _components.length; i++) table.appendChild(_components[i]);

    /* WRITE CALENDAR TO PAGE */
    container.appendChild(table);

    /* HTML OBJECTS IN THE CALENDAR */
    var tb = container.getElementsByTagName("TBODY")[0];
    var tds = tb.getElementsByTagName("TD");
    var links = tb.getElementsByTagName("A");

    /* SET CLASS NAMES FOR WEEKEND DAYS */
    for(i=0; i < tds.length; i++)
    {
      var _euro = (this.localization == "euro") ? 5 : 0; // CHANGE CELL INDEX FOR EUROPEAN CALENDAR FORMAT

      if(tds[i].cellIndex == _euro || tds[i].cellIndex == 6) tds[i].className += " weekendDay";
    }

    /* IF DATE PICKER IS ENABLED */
    if(this.datepicker)
    {
      this.date_picker(links);
      this.track_selected(links);
    }
  }
}

/* ADD EVENTS TO CALENDAR */
Calendar.addEvent;

if(document.addEventListener)
{
  Calendar.prototype.addEvent = function(obj, type, fn)
  {
    obj.addEventListener(type, fn, false);
  }
}
else if(document.attachEvent)
{
  Calendar.prototype.addEvent = function(obj, type, fn)
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

/* AUTO SET CALENDAR LOCALIZATION/LANGUAGE */
Calendar.prototype.meta_data = function()
{
  var head = document.getElementsByTagName("HEAD")[0];
  var meta_tags = head.getElementsByTagName("META");

  for(i=0; i < meta_tags.length; i++)
  {
    var content = meta_tags[i].getAttribute("content").toLowerCase();
    var http = meta_tags[i].httpEquiv.toLowerCase();

    switch(http)
    {
      case "content-language" : this.language = content;
      break;

      case "localization" : this.localization = content;
      break;

      case "format" : this.format = content;
      break;

      case "country" : this.country = content;
      break;
    }
  }
}