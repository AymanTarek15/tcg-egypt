import Container from "@/app/components/layout/Container/Container";
import SectionTitle from "@/app/shared/sectionTitle/SectionTitle";
import CardSkeletonGrid from "@/app/components/cards/CardSkeleton/CardSkeleton";

export default function Loading() {
  return (
    <section style={{ padding: "60px 0" }}>
      <Container>
        <SectionTitle
          title="Browse Cards"
          subtitle="Search, sort, and filter cards."
        />
        <div style={{ height: 24 }} />
        <CardSkeletonGrid count={16} />
      </Container>
    </section>
  );
}
