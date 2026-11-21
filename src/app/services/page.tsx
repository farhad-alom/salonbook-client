import ServicesBrowser from '@/components/ServiceBrowser';
export const metadata = { title: "Browse Services" };

const ServicesPage = async ({ searchParams }: { searchParams: Promise<{ category?: string }> }) => {

    const params = await searchParams;
    const category = params.category || "";
    return <ServicesBrowser key={category} initialCategory={category} />
};

export default ServicesPage;