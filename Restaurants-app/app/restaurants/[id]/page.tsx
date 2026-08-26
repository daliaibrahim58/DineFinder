import RestaurantDetails from "@/components/restaurant/RestaurantDetails";

interface PageProps {
  params: Promise<{
    id: string;
    // add any other dynamic params here
    // slug: string;
    // category: string;
  }>;
}

export default async function RestaurantDetailsPage({
  params,
}: PageProps) {
  const routeParams = await params;

  return (
    <RestaurantDetails
      params={routeParams}
    />
  );
}