import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

export default function useUser() {
    return useSWR('/api/user', async arg => {
        const response = await fetch(arg);
        const data = await response.json();
        return data;
    });
}