const express = require("express");
const route = require("route");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/css", express.static("views/css"));
app.use("/js", express.static("views/js"));
app.use("/images", express.static("views/images"));
app.use("/assets", express.static("views/assets"));
app.use("/fonts", express.static("views/fonts"));
app.set("views");
app.set("view engine", "ejs");

const teamMember = require("./models/teamMember");
const blogs = require("./models/blog");
const { update } = require("./models/teamMember");
require("dotenv").config();
const value = new Map();

value.set("Convenor", 1);
value.set("Co-Convenor", 2);
value.set("Technical Head", 3);
value.set("Graphics Designer", 4);
value.set("Creative Head", 5);
value.set("Core Member", 6);

const db = require("./setup/myurl").mongoURL;
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    //loading blogs
    blogs
        .find()
        .then((blogCollection) => {
            res.render("index.ejs", { blogs: blogCollection });
        })
        .catch((err) => console.log(err));
});

//@type GET
//@route /blogs
//@desc route to blogs page
//@access PUBLIC

app.get("/blogs", (req, res) => {
    //loading blogs
    var pageNu = 1;
    if (req.query.page) pageNu = req.query.page;

    blogs
        .find()
        .then((blogCollection) => {
            const totalPage = Math.ceil(blogCollection.length / 9);
            pageNu = Math.min(pageNu, totalPage);
            pageNu = Math.max(pageNu, 1);
            res.render("blog.ejs", {
                blogs: blogCollection,
                totalPage: totalPage,
                page: pageNu,
            });
        })
        .catch((err) => console.log(err));
});

//@type GET
//@route /teams/
//@desc route to fetch all the teams data
//@access PUBLIC

app.get("/team/:year", (req, res) => {
    var year = req.params.year;
    if (req.query.year) year = req.quey.year;
    teamMember
        .find()
        .then((teams) => {
            var team = teams.filter((team) => team.year == year);
            team[0]["Member"].sort((a, b) => {
                if (value.get(a.position) > value.get(b.position)) return 1;
                return -1;
            });
            res.render("teams.ejs", {
                team: team,
            });
        })
        .catch(function (err) {
            return console.log(err);
        });
});

//@type GET
//@route /blog/
//@desc reading the blog
//@access PUBLIC

app.get("/blog/:id", (req, res) => {
    var id = req.params.id;
    blogs
        .find()
        .then((blogCollection) => {
            var blog = blogCollection.find((b) => b.id == id);
            blogCollection = blogCollection.filter((item) => item.id !== id);
            blogCollection.sort((a, b) => {
                var A = 0,
                    B = 0;
                for (var i = 0; i < blog.tags.length; ++i) {
                    if (a.tags.includes(blog.tags[i])) A++;
                    if (b.tags.includes(blog.tags[i])) B++;
                }
                if (A < B) return 1;
                return -1;
            });
            res.render("reading.ejs", {
                blogs: blogCollection,
                blog: blog,
            });
            var myquery = { views: blog.views };
            var newvalues = { $set: { views: blog.views + 1 } };
            blogs.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
            });
        })
        .catch((err) => console.log(err));
});

//@type GET
//@route /events/
//@desc route to Events page
//@access PUBLIC

app.get("/events", (req, res) => {
    res.render("events");
});

// app.get("/test", (req, res) => {
//     blogs
//         .find()
//         .then((blogCollection) => {
//             res.render("test.ejs", { blogs: blogCollection });
//         })
//         .catch((err) => console.log(err));
// });

//@type Post
//@route /SaveTeam/
//@desc route to Save team Members
//@access PRIVATE

// app.get("/addblog", (req, res) => {
//     const blog = new blogs();
//     blog.auther = "Mihir Khambhati";
//     blog.title = "Chess";
//     blog.content =
//         "Chess is a two-player strategy board game played on a checkered board with 64 squares arranged in an 8×8 square grid. Played by millions of people worldwide, chess is believed to be derived from the Indian game chaturanga sometime before the 7th century. Chaturanga is also the likely ancestor of the East Asian strategy games xiangqi (Chinese chess), janggi (Korean chess), and shogi (Japanese chess). Chess reached Europe via Persia and Arabia by the 9th century, due to the Umayyad conquest of Hispania. The queen and bishop assumed their current powers in Spain in the late 15th century, and the modern rules were standardized in the 19th century.Play involves no hidden information. Each player begins with 16 pieces: one king, one queen, two rooks, two knights, two bishops, and eight pawns. Each piece type moves differently, with the most powerful being the queen and the least powerful the pawn. The objective is to checkmate the opponent's king by placing it under an inescapable threat of capture. To this end, a player's pieces are used to attack and capture the opponent's pieces, while supporting one another. During the game, play typically involves exchanging pieces for the opponent's similar pieces, and finding and engineering opportunities to trade advantageously or to get a better position. In addition to checkmate, a player wins the game if the opponent resigns, or in a timed game, runs out of time. There are also several ways a game can end in a draw.";
//     blog.image = "https://scosh-svnit.herokuapp.com/static/img/blog-img/6.jpg";
//     blog.date = "26 June 2020";
//     blog.views = Math.floor(Math.random() * 10000);
//     blog.tags.push({ tag: "Google" });
//     blog.tags.push({ tag: "Amazon" });
//     blog.tags.push({ tag: "Apple" });
//     blog.tags.push({ tag: "Google" });
//     blog.tags.push({ tag: "Amazon" });
//     blog.tags.push({ tag: "Apple" });
//     blog.tags.push({ tag: "Google" });
//     blog.tags.push({ tag: "Amazon" });
//     blog.tags.push({ tag: "Apple" });

//     blog.save()
//         .then((result) => {
//             res.send("done");
//         })
//         .catch((err) => console.log(err));
// });

//@type Post
//@route /SaveTeam/
//@desc route to Save team Members
//@access PRIVATE

// app.get("/save", (req, res) => {
//     res.render("saveteam");
// });

// app.post("/addmember", (req, res) => {
//     const member = new teamMember();
//     console.log(req.body);
//     member.year = req.body.year;
//     let data = {
//         image: req.body.image,
//         name: req.body.name,
//         position: req.body.position,
//         facebook: req.body.facebook,
//         linkedin: req.body.linkedin,
//         gmail: req.body.gmail,
//         instagram: req.body.instagram,
//     };
//     member.Member.push(data);
//     teamMember.findOne({ year: member.year }).then((MemberData) => {
//         if (!MemberData) {
//             member
//                 .save()
//                 .then((result) => {
//                     res.redirect("/save");
//                 })
//                 .catch((err) => console.log(err));
//         } else {
//             console.log("update");
//             MemberData["Member"].push(data);
//             MemberData.save()
//                 .then((result) => {
//                     res.redirect("/save");
//                 })
//                 .catch((err) => console.log(err));
//         }
//     });
// });

app.get("/tryHackMe", (req, res) => {
    res.send("<h1> I Am Inevitable </h1> <h2>Stop scaning the website.</h2>");
});
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server runnng at port ${port}`));
