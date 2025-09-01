"use client";

import { useGates } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "@/components/link";
import { GateHeader } from "@/modules/gate/ui/components/gate-header";

const GateListPage = () => {
  const { data: gates, isLoading, error } = useGates();

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Loading Gates...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4 text-red-600'>
            Error Loading Gates
          </h1>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <GateHeader gateId='SELECTION' />
      
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Parking Gates</h1>
          <p className='text-gray-600'>Select a gate to manage check-ins</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {gates?.map((gate) => (
            <Card key={gate.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>{gate.name}</span>
                  <Badge variant='outline'>{gate.id}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <MapPin className='h-4 w-4' />
                    <span>{gate.location}</span>
                  </div>

                  <div className='text-sm text-gray-600'>
                    <span className='font-medium'>Zones: </span>
                    {gate.zoneIds.join(", ")}
                  </div>

                  <Link href={`/gate/${gate.id}`}>
                    <Button className='w-full mt-4'>
                      Access Gate
                      <ArrowRight className='h-4 w-4 ml-2' />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GateListPage;
