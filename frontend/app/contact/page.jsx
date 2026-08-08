import { contactMetadata } from "@/metadata/contact";
import ContactClient from "./ContactClient";

export const metadata = contactMetadata

export default function ContactPage() {
    return <ContactClient />;
}