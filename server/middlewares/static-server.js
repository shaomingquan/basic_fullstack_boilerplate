const send = require("koa-send");
const { to } = require("../utils");

// export module
module.exports = ({ static_root = "../client/dist", api_root = "/api" }) => {
  return async (ctx, next) => {
    // helper constants
    const oneYear = 31557600000;
    const root = static_root;

    // check if request url start with a particular path
    const urlStartWith = path => ctx.path.indexOf(path) === 0;

    // pass it if it's an ajax call
    if (urlStartWith(api_root)) return await next();

    // make a 404 error
    const error404 = () => {
      const err = new Error("Not found");
      err.status = 404;
      return e;
    };

    // send file under root
    //  - return [ whetherOrNotFileIsSent, errorObject ]
    const sendFile = async (localFilePath, opts) => {
      return await to(send(ctx, localFilePath, { root, ...opts }));
    };

    // not ajax then static
    // handle GET request
    if (ctx.method === "HEAD" || ctx.method === "GET") {
      // if start with /wstatic
      //  - try to find the file in local disk and send it with MAX expiration
      //  - if sent: we're done
      //  - if not: return error
      if (urlStartWith("/static")) {
        const [sent, error] = await sendFile(ctx.path, { maxage: oneYear });
        if (sent) return;
        else throw error || error404();
      }

      // if start with anything else
      //  - try to find the file in local disk and send it
      //  - if sent: we're done
      //  - if not: send index.html
      else {
        const [sent] = await sendFile(ctx.path);
        if (sent) return;
        else {
          const [sentIndexHtml, error] = await sendFile("index.html");
          if (sentIndexHtml) return;
          else throw error || error404();
        }
      }
    }

    return next();
  };
};
