const express = require('express');
const { spawn } = require('child_process');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

function runMildew(script, res) {
    const child = spawn("./bin/dmildew_run", ["-i"]);
    child.stdin.write(script + '\n');
    child.stdin.end();
    let out = "";
    let err = "";
    child.stdout.on("data", data => {
        console.log("" + data);
        out += data;
    })
    child.stderr.on("data", data => {
        err += data;
    });
    child.on("close", ()=>{
        res.header("Access-Control-Allow-Origin", "*");
        res.contentType("application/json");
        res.end(JSON.stringify({
            out: out,
            err: err
        }))
    });
}

app.post("/run", (req, res)=>{
    console.log("req.body=", req.body);
    res.contentType("application/json");
    runMildew(req.body.script, res);
});

const server = app.listen(6001, ()=>{
    const host = server.address().address;
    const port = server.address().port;
    console.log(`DMReplServer listening at http://${host}:${port}`);
});
