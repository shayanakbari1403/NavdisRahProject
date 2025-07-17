const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
//const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const conf = require('./core/config.js');

// Connection URL

let db;
let collection;
let menuItems;
// Database Name
const dbName = "navdis-website";

// Create a new MongoClient
//const client = new MongoClient(conf.db.address, { useNewUrlParser: true });

// Use connect method to connect to the Server
//client.connect(function (err) {
//  assert.equal(null, err);
//  console.log("Connected successfully to server");

//  db = client.db(dbName);
//  collection = db.collection("resources");
//  collection.findOne({ name: "menu" }, function (err, docs) {
//    assert.equal(err, null);
//    menuItems = docs;
//  });
//});

const fs  = require("fs");

const jsonFilePath = "mongodb_collection/navdis-website.resources.json";

// Read and parse JSON data
fs.readFile(jsonFilePath, "utf8", (err, data) => {
	if (err) {
			console.error("Error reading Json file:", err);
			return;
	}
	try {
		collection = JSON.parse(data.replace(/\{\s*"\$oid"\s*:\s*"(.*?)"\s*\}/g, '"$1"'));
		menuItems = collection.find(item => item.name === "menu");
		console.log("Extracted menu items:", menuItems);
	} catch (parseErr) {
		console.error("Error parsing JSON data:", parseErr);
	}
});

app.use("/images", express.static("images"));
app.use("/fonts", express.static("fonts"));
app.use("/css", express.static("css"));
app.use("/inc", express.static("inc"));
app.use("/js", express.static("js"));
app.use("/fa/images", express.static("images"));
app.use("/fa/fonts", express.static("fonts"));
app.use("/fa/css", express.static("css"));
app.use("/fa/inc", express.static("inc"));
app.use("/fa/js", express.static("js"));
app.use("/en/images", express.static("images"));
app.use("/en/fonts", express.static("fonts"));
app.use("/en/css", express.static("css"));
app.use("/en/inc", express.static("inc"));
app.use("/en/js", express.static("js"));

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "home",
    helpers: {
      menu: function (lang, options) {
        let langItems;
        let align = 'right';
        if (lang && lang == "en") {
          langItems = menuItems.en;
          align = 'left';
        }
        else langItems = menuItems.fa;
        console.log("menu " + lang);
        var out = `<ul class='nav-menu' style='text-align:${align};' >`;
        for (var i = 0, l = langItems.length; i < l; i++) {
          out =
            out +
            `<li><a href="${langItems[i].url}">${langItems[i].title}</a></li>`;
        }
        return out + "</ul>";
      },
      isRtl: function (v1, options) {
        if (v1 == "fa") {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      isEqual: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
      toggleLabel: function (lang) {
	if(lang === 'fa') {
		return "منو";
	} else {
		return "Menu";
	}
      },
      projectDetails: function (lang) {
	if(lang === 'fa') {
		return "جزئیات پروژه";
	} else {
		return "Project Details";
	}
      },
      projectName: function (lang) {
	if(lang === 'fa') {
		return "نام پروژه";
	} else {
		return "Project Name";
	}
      },
      employerFunc: function (lang) {
	if(lang === 'fa') {
		return "کارفرما";
	} else {
		return "Employer";
	}
      },
      supervision: function (lang) {
	if(lang === 'fa') {
		return "دستگاه نظارت";
	} else {
		return "Supervision";
	}
      },
      startYear: function (lang) {
	if(lang === 'fa') {
		return "سال شروع";
	} else {
		return "Start Year";
	}
      },
      endYear: function (lang) {
	if(lang === 'fa') {
		return "سال خاتمه";
	} else {
		return "End Year";
	}
      },
      statusFunc: function (lang) {
	if(lang === 'fa') {
		return "وضعیت";
	} else {
		return "Status";
	}
      },
      constructionHighlights: function (lang) {
	if(lang === 'fa') {
		return "مشخصات کار";
	} else {
		return "Construction Highlights";
	}
      },
    },
  })
);
console.log("Before setting view engine");
app.set("view engine", "handlebars");

app.get("/en", (req, res) => {
  // Get the documents collection
  // Insert some documents

  const docs = collection.find(item  => item.name==="index" && item.lang === "en");
  if(!docs) {
	console.error("No matching record found");
  } else {
    res.render("home/index", docs);
  }
});
app.get("/en/index", (req, res) => {
  // Get the documents collection
  // Insert some documents

  const docs = collection.find(item => item.name === "index" && item.lang === "en");
  if(!docs) {
	console.error("No matching record found");
  } else {
    res.render("home/index", docs);
  }
});
app.get("/fa", (req, res) => {
  const docs = collection.find(item => item.name === "index" && item.lang === "fa");
  if(!docs) {
	console.error("No matching record found");
  } else {
    res.render("home/index", docs);
  }
});

// app.get('/:page?', (req, res)=>{
//     let p = req.params.page;
//     if(!p){
//         p='index';
//     }
//      // Get the documents collection
//   // Insert some documents
//     collection.findOne({'name': p,'lang':'fa'},function(err, docs) {
//     assert.equal(err, null);
//     console.log("Found the following records");
//     console.log(req.params.lang);

//     res.render('home/index',docs);
//   });
// });

app.get("/", (req, res) => {
  const docs = collection.find(item => item.name === "index" && item.lang === "fa");
  if(!docs) {
	console.error("No Matching record found");
  } else {
    res.render("home/index", docs);
  }
});
app.get("/index", (req, res) => {
  const docs = collection.find(item => item.name === "index" && item.lang === "fa");
  if(!docs) {
	  console.error("No Matching record found");
  } else {
    res.render("home/index", docs);
  }
});
app.get("/fa/index", (req, res) => {
	const docs = collection.find(item => item.name === "index" && item.lang === "fa");
  if(!docs) {
	  console.error("No Matching record found");
  } else {
    res.render("home/index", docs);
  }
});
app.get("/fa/projects", (req, res) => {
  const docs = collection.find(item => item.name === "projects" && item.lang === "fa");
  if(!docs) {
	  console.error("No Matching record found");
  } else {
    const projectsList = docs.list.map(p => ({
      ...p,
      year: isNaN(p.subtitle) || p.subtitle === '' ? 3000 : parseInt(p.subtitle)
    })).sort((a, b) => b.year - a.year);


    const model = {
      ...docs,
      list: projectsList
    }
    res.render("home/projects", model);
  }
});
app.get("/en/projects", (req, res) => {
  const selectedCategory = req.params.category || "All";
  const docs = collection.find(item => item.name === "projects" && item.lang === "en");
  if(!docs) {
	  console.error("No matching record found");
  } else {
  const projectsList = docs.list.map(p => ({
      ...p,
      year: isNaN(p.subtitle) || p.subtitle === '' ? 3000 : parseInt(p.subtitle)
    })).sort((a, b) => b.year - a.year);
 
 if(selectedCategory !== "All")
 {
	 projectsList = projectsList.filter(project => project.categories.includes(selectedCategory);
 }
    const model = {
      ...docs,
      list: projectsList
    }
    res.render("home/projects", model);
  }
});
app.get("/fa/about", (req, res) => {
  const docs = collection.find(item => item.name === "about" && item.lang === "fa");
  if(!docs) {
	  console.error("No matching record found");
  } else {
    res.render("home/about", docs);
  }
});
app.get("/en/about", (req, res) => {
  const docs = collection.find(item => item.name === "about" && item.lang === "en");
  if(!docs) {
	  consle.error("No matching record found");
  } else {
    res.render("home/about", docs);
  }
});
app.get("/fa/appreciations", (req, res) => {
  const docs = collection.find(item => item.name === "appreciations" && item.lang === "fa");
  if(!docs) {
	  consle.error("No matching record found");
  } else {
      res.render("home/appreciations", docs);
  }
});
app.get("/fa/contact", (req, res) => {
  const docs = collection.find(item => item.name === "contact" && item.lang === "fa");
  if(!docs) {
	  consle.error("No matching record found");
  } else {
    res.render("home/contact", docs);
  }
});
app.get("/en/contact", (req, res) => {
  const docs = collection.find(item => item.name === "contact" && item.lang === "en");
  if(!docs) {
	  consle.error("No matching record found");
  } else {
    res.render("home/contact", docs);
  }
});

app.get("/fa/project/:id", (req, res) => {
  let projectId = req.params.id;

  const docs = collection.find(item => item.name === "project" && item.lang === "fa" && item.id === projectId);
      if (docs == null) {
        res.render("home/not_found", { lang: "fa" });
      } else {
      	res.render("home/project", docs);
      }
});
console.log("Before en/project");
app.get("/en/project/:id", (req, res) => {
  let projectId = req.params.id;

  const docs = collection.find(item => item.name === "project" && item.lang === "en" && item.id === projectId);
  if (docs == null) {
        res.render("home/not_found", { lang: "en" });
  } else {
      res.render("home/project", docs);
  } 
});
app.get("/fa/services/:name", (req, res) => {
  let serviceName = req.params.name;
  const docs = collection.find(item => item.name === "projects" && item.lang === "fa");
  if (docs == null) {
        res.render("home/not_found", { lang: "en" });
  } else {
    docs.list.sort((a, b) =>
      parseInt(a.subtitle) < parseInt(b.subtitle)
        ? 1
        : parseInt(b.subtitle) < parseInt(a.subtitle)
          ? -1
          : 0
    );
    docs["service"] = serviceName;
    res.render("home/projects", docs);
  }
});
app.get("/en/services/:name", (req, res) => {
  let serviceName = req.params.name;
  const docs = collection.find(item => item.name === "projects" && item.lang === "en");
  if (docs == null) {
        res.render("home/not_found", { lang: "en" });
  } else {
    docs.list.sort((a, b) =>
      parseInt(a.subtitle) < parseInt(b.subtitle)
        ? 1
        : parseInt(b.subtitle) < parseInt(a.subtitle)
          ? -1
          : 0
    );
    docs["service"] = serviceName;
    res.render("home/projects", docs);
  }
});
app.use(function (req, res, next) {
  res.render("home/not_found");
})
app.listen(conf.server.port, () => {
  console.log("listening");
});
console.log("done");
