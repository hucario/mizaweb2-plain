
import page from "//unpkg.com/page/page.mjs";
page.start({
    
})
page.strict(false);

page((ctx, next) => {
    console.log(ctx)
    next();
});

page('/', () => {
    console.log('goin home');
})

page('*', () => {
    console.log('goin somewhere else');
})