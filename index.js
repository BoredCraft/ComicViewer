
import { fetch } from "./modules/imgURLFetcher.js";
import { init, putLoadingIndicator } from "./modules/imgURLHandler.js";
putLoadingIndicator();
fetch(init);



