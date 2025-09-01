"use client";

import { GateView } from "@/modules/gate/ui/views/gate-view";
import { useParams } from "next/navigation";


const GatePage = () => {
  const params = useParams();
  const gateId = params.gateId as string;

  return <GateView gateId={gateId} />;
};

export default GatePage;
