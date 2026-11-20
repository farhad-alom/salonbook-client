import ServicesBrowser from '@/components/ServiceBrowser';

const ServicesPage = async ({ searchParams }: { searchParams: Promise<{ category?: string }> }) => {

    const params = await searchParams;
    const category = params.category || "";
    return <ServicesBrowser key={category} initialCategory={category} />
};

export default ServicesPage;