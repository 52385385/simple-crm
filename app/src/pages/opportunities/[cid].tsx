import { useRouter } from "next/router"
import PageContainer from "../../components/PageContainer";

export default function CustomerOpportunities() {
    const router = useRouter();
    const { cid } = router.query;
    return (
        <PageContainer>
            <div>{cid}</div>
        </PageContainer>
    )
}