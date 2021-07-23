import {createParamDecorator} from "../../../lib/utils/utils";

export const Param = createParamDecorator((req, _, name: string) => {
    if (name ?? false) {
        return req.params[name];
    }

    return req.params;
})
