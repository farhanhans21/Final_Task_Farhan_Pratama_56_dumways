const express = require("express");
const app = express();
const port = 3000;
const query = require("sequelize");
const model = require("./models/model");
const { QueryTypes, where } = require("sequelize");
const { SELECT } = require("sequelize/lib/query-types");
const db = require("./src/db");
const hash = require("./src/bcryptFile");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const path = require("path");
const flash = require("express-flash");

app.set("view engine", "hbs");
app.set("views", "views");

app.set("trush proxy", 1);
app.use(bodyParser.json());
app.use("/asset", express.static("asset"));
app.use("/style", express.static("style"));
app.use("/views", express.static("views"));

app.use(express.urlencoded({ extended: true })); // perlu dipahami1
app.use(
  session({
    secret: "finaltask",
    cookie: { maxAge: 3600000, httpOnly: true, secure: false },
    saveUninitialized: true,
    resave: false,
    store: new session.MemoryStore(),
  })
);
app.use(flash());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../asset/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Simpan dengan nama unik
  },
});
const upload = multer({ storage: storage });

app.get("/", getIndex);
app.get("/login", getLogin);
app.post("/login", postLogin);
app.get("/register", getRenderRegistrasi);
app.post("/register", postRegister);

app.get("/postProvinsi", getRenderProvinsi);
app.post("/postProvinsi", upload.single("photo"), postProvinsi);
app.post("/updateProvinsi/:id", upload.single("photo"), updateProvinsi);
app.get("/updateProvinsi/:id", updateRenderProvinsi);
app.get("/deleteProvinsi/:id", deleteProvinsi);

app.get("/getKabupaten", getRenderKabupaten);
app.post("/postKabupaten", upload.single("photo"), postKabupaten);
app.get("/updateKabupaten/:id", updateRenderKabupaten);
app.post("/updateKabupaten/:id", upload.single("photo"), updateKabupaten);
app.get("/deleteKabupaten/:id",deleteKabupaten);

app.get("/view-detail/:id", getViewDetail);

async function getIndex(req, res, next) {
  try {
    const isLogin = req.session.userId;
    if (!isLogin) {
      req.flash("error", "anda tidak berhak disini");
      res.redirect("/login");
    }

    const results = await model.provinsi_tb.findAll();
    const query = `select *from finaltask.provinsi_tb pt where user_id = :isLogin`;
    const [tampil] = await db.query(query, {
      replacements: { isLogin: req.session.userId },
      typeQuery: SELECT,
    });

    tampil.forEach((element) => {
      element.photo = JSON.parse(element.photo);
      element.photo.path = element.photo.path.replaceAll('\\','/')
      console.log(element.photo);
    });
    
    res.render("index", { data: tampil, data2: results });
  } catch (error) {
    console.log(error);
  }
}

async function getLogin(req, res) {
  res.render("login");
}
async function postLogin(req, res) {
  try {
    const email = req.body.email;
    const userEmail = await model.user_tb.findOne({ where: { email: email } });
    const pass = req.body.password;
    const check = await hash.comparePassword(pass, userEmail.password);
    const emailCheck = userEmail.email;
    if (req.session) {
      req.session.userId = userEmail.id;
      req.session.username = userEmail.username;
      req.session.email = userEmail.email;
    }

    if (email == emailCheck && check) {
      req.session.username = [0];
      console.log(req.session);
      req.session.isLogin = true;

      req.flash("info", "login sukses");

      res.redirect("/");
    } else {
      console.log("gagal");
      req.flash("error", "login gagal");
      res.redirect("/login");
      return;
    }
  } catch (error) {
    console.log(error);
    res.redirect("/login");
  }
}
async function getRenderRegistrasi(req, res) {
  res.render("register");
}
async function postRegister(req, res) {
  try {
    const newObject = {
      email: req.body.email,
      username: req.body.username,
      password: await hash.hashPassword(req.body.password),
    };

    await model.user_tb.create(newObject);
    req.flash("info", "register sukses");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
}

async function getRenderProvinsi(req, res) {
  try {
    const isLogin = req.session.userId;
    if (!isLogin) {
      req.flash("error", "anda tidak berhak disini");
      res.redirect("/login");
    }
    res.render("postProvinsi");
  } catch (error) {
    console.error(error);
  }
}
async function postProvinsi(req, res) {
  try {
    if (!req.session.userId) {
      req.flash("error", "anda dilarang disini, silakan register dan login!");
      res.redirect("/login");
    }
    const provObj = {
      nama: req.body.nama,
      user_id: req.session.userId,
      diresmikan: req.body.diresmikan,
      photo: JSON.stringify(req.file),
      pulau: req.body.pulau,
    };
    await model.provinsi_tb.create(provObj);

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}
async function getRenderKabupaten(req, res) {
  try {
    const isLogin = req.session.userId;
    if (!isLogin) {
      req.flash("error", "anda tidak berhak disini");
      res.redirect("/login");
    }
    const query = ` select distinct id, nama from finaltask.provinsi_tb`;
    const [provinsi] = await db.query(query, { QueryType: SELECT });
    res.render("postKabupaten", { data: provinsi });
  } catch (error) {
    console.error(error);
  }
}

async function updateRenderProvinsi(req, res) {
  try {
    const idCari = parseInt(req.params.id);
    const hasil = await model.provinsi_tb.findOne(
      { where: { id: idCari } },
      {
        type: QueryTypes.SELECT,
      }
    );

    res.render("updateProvinsi", { data: hasil });
  } catch (error) {
    console.error(error);
  }
}
async function updateProvinsi(req, res) {
  try {
    idProvinsi = req.params.id;
    const obj = {
      nama: req.body.nama,
      diresmikan: req.body.diresmikan,
      pulau: req.body.pulau,
      photo: JSON.stringify(req.file),
    };
    await model.provinsi_tb.update(obj, { where: { id: idProvinsi } });
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}
async function deleteProvinsi(req, res) {
  try {
    const idProvinsi = req.params.id;
    await model.provinsi_tb.destroy({ where: { id: idProvinsi } });
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}
async function postKabupaten(req, res) {
  try {
    const params = req.body.provinsi_id;
    const kabObj = {
      nama: req.body.namaKab,
      provinsi_id: params,
      diresmikan: req.body.diresmikan,
      photo: JSON.stringify(req.file),
    };
    await model.kabupaten_tb.create(kabObj);
    // flash.success('info', 'data kabupaten telah di tambahkan!');
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
}
async function getViewDetail(req, res) {
  try {
    const idProvinsi = parseInt(req.params.id);
    const isLogin = req.session.userId;
    if (!isLogin) {
      req.flash("error", "anda tidak berhak disini");
      res.redirect("/login");
    }
    const query = `select *from finaltask.kabupaten_tb where provinsi_id = :id`;
    const results = await db.query(query, {
      replacements: { id: idProvinsi },
      type: QueryTypes.SELECT,
    });

    res.render("view-detail", { data: results });
  } catch (error) {
    console.error(error);
  }
}
async function updateRenderKabupaten(req, res) {
  try {
    const idKab = parseInt(req.params.id);
    const hasil = await model.kabupaten_tb.findOne(
      { where: { id: idKab } },
      {
        type: QueryTypes.SELECT,
      }
    );
    const query2 = ` select distinct id, nama from finaltask.provinsi_tb`;
    const [provinsi] = await db.query(query2, { QueryType: SELECT });
    res.render("updateKab", {
      data: hasil,
      data2: provinsi,
    });
  } catch (error) {
    console.error(error);
  }
}
async function updateKabupaten(req, res) {
  try {
    const idKab = req.params.id;

    const obj = {
      nama: req.body.namaKab,
      diresmikan: req.body.diresmikan,
      photo: JSON.stringify(req.file),
    };
    const results = await model.kabupaten_tb.update(obj, {
      where: { id: idKab },
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    
  }
}
async function deleteKabupaten(req,res) {
  try {
    const idKab = req.params.id;
    await model.kabupaten_tb.destroy({ where: { id: idKab } });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    
  }
}
app.listen(port, async () => {
  try {
    db.authenticate()
      .then(() => {
        console.log("connection established");
      })
      .catch((err) => console.error(err));

    console.log(`server running on port ${port}`);
  } catch (error) {
    console.error(error);
  }
});
