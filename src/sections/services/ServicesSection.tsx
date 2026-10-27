import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { serviceItems } from "./config/serviceItems";
import ScrollElement from "@/components/ui/scroll-animation";

const ServicesSection = () => {
  return (
    <section className="py-10 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <ScrollElement
            viewport={{ amount: 0.5, margin: "0px 0px -100px 0px" }}
            className="mx-auto max-w-3xl"
          >
            <h2
              id="services-heading"
              className="text-4xl font-bold tracking-tight md:text-5xl"
            >
              <span className="text-foreground">My </span>
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Here are some of the services I offer:</p>
          </ScrollElement>
        </div>
        <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[16rem] md:auto-rows-[20rem] lg:auto-rows-[22rem] lg:grid-rows-4">
          {serviceItems.map((item, i) => (
            <BentoCard key={i} {...item} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default ServicesSection;
