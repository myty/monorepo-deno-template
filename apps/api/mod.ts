// deno run --allow-net --allow-read --allow-env mod.ts

import opine from 'https://deno.land/x/opine@2.1.2/mod.ts';

const app = opine();

app.get('/', function (req, res) {
    res.send('Hello Deno!');
});

if (import.meta.main) {
    // You can call listen the same as Express with just
    // a port: `app.listen(3000)`, or with any arguments
    // that the Deno `http.serve` methods accept. Namely
    // an address string, HttpOptions or HttpsOptions
    // objects.
    app.listen({ port: 3000 });
    console.log('Opine started on port 3000');
}

export { app };
