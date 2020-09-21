<template>
    <tr :class="{ 'is-danger': isError > 0, 'is-success': isError < 0 }">
        <td class="status">
            <template v-if="isError === 0">
                <span class="button is-loading is-static is-outlined"></span>
            </template>
            <template v-else>
                <span
                    class="icon"
                    :class="{
                        'has-text-danger': isError > 0,
                        'has-text-success': isError < 0,
                    }"
                    ><font-awesome-icon
                        :icon="isError > 0 ? 'ban' : 'check-square'"
                    ></font-awesome-icon
                ></span>
            </template>
        </td>
        <th>{{ anchor.label }}</th>
        <td class="break-all">{{ anchor.href }}</td>
        <td>{{ anchor.target }}</td>
        <td class="break-all">
            <a :href="anchor.url" target="_blank">{{ anchor.url }}</a>
        </td>
    </tr>
</template>

<script lang="ts">
import {
    defineComponent,
    Ref,
    PropType,
    onMounted,
    ref,
    computed,
    watch,
} from "vue";

// Store
import {
    useStore as useLink,
    ResultType as LinkResultType,
} from "../../store/link";

const checkUrl = async (
    requestParam: { url: string; user: string; pass: string },
    isError: Ref<number>
) => {
    let result;

    if (
        requestParam.url.match("^javascript:") ||
        requestParam.url.match("^tel:")
    ) {
        isError.value = -1;
        return;
    }

    try {
        result = await (window as any).link_exists(requestParam);
    } catch (e) {
        console.error(e);
        isError.value = 1;
        return;
    }

    if (!result) {
        isError.value = 1;
        return;
    }

    isError.value = -1;
};

export default defineComponent({
    name: "ComponentLinkRow",
    props: {
        anchor: { type: Object as PropType<LinkResultType>, required: true },
    },
    setup(props) {
        const linkStore = useLink();

        const isError = ref<number>(0);
        const url = computed(() => props.anchor.url);

        onMounted(() => {
            const user = linkStore.user;
            const pass = linkStore.pass;

            checkUrl({ url: url.value, user, pass }, isError);
        });

        watch(url, (newVal) => {
            const url = newVal;
            const user = linkStore.user;
            const pass = linkStore.pass;

            checkUrl({ url, user, pass }, isError);
        });

        return { isError };
    },
});
</script>

<style scoped>
.break-all {
    word-break: break-all;
}

table.table .is-danger {
    background: #ffd1da;
}
table.table .is-success {
    background: #f6fef9;
}
</style>
