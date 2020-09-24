import { inject } from "vue";

export const bucketKey = "bucket";
export function useBucket(key = null) {
    return inject(key !== null ? key : bucketKey);
}
