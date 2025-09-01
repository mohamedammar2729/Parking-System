"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Printer,
  Download,
  Ticket as TicketIcon,
} from "lucide-react";
import type { Ticket } from "@/server/types";

interface TicketModalProps {
  ticket: Ticket;
  gateId: string;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  ticket,
  gateId,
  onClose,
}) => {


  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

//   const handlePrint = () => {
//     const printContent = document.getElementById("ticket-content");
//     if (printContent) {
//       const printWindow = window.open("", "_blank");
//       if (printWindow) {
//         printWindow.document.write(`
//           <html>
//             <head>
//               <title>Parking Ticket - ${ticket.id}</title>
//               <style>
//                 body { font-family: monospace; margin: 20px; }
//                 .ticket { border: 2px solid #000; padding: 20px; max-width: 400px; }
//                 .header { text-align: center; font-weight: bold; margin-bottom: 20px; }
//                 .row { display: flex; justify-content: space-between; margin: 10px 0; }
//                 .label { font-weight: bold; }
//                 hr { margin: 15px 0; }
//               </style>
//             </head>
//             <body>
//               ${printContent.innerHTML}
//             </body>
//           </html>
//         `);
//         printWindow.document.close();
//         printWindow.print();
//       }
//     }
//   };

  const handleDownload = () => {
    const ticketData = {
      id: ticket.id,
      type: ticket.type,
      zoneId: ticket.zoneId,
      gateId: ticket.gateId,
      checkinAt: ticket.checkinAt,
    };

    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `parking-ticket-${ticket.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <CheckCircle className='h-5 w-5 text-green-600' />
            Check-in Successful!
          </DialogTitle>
        </DialogHeader>

        {/* Ticket Content */}
        <Card>
          <CardContent id='ticket-content' className='p-6'>
            <div className='text-center mb-6'>
              <div className='flex items-center justify-center gap-2 mb-2'>
                <TicketIcon className='h-6 w-6' />
                <h3 className='text-lg font-bold'>PARKING TICKET</h3>
              </div>
              <Badge
                variant={ticket.type === "visitor" ? "default" : "secondary"}
                className='text-sm'
              >
                {ticket.type.toUpperCase()}
              </Badge>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='font-medium'>Ticket ID:</span>
                <span className='font-mono text-sm'>{ticket.id}</span>
              </div>

              <Separator />

              <div className='flex justify-between'>
                <span className='font-medium'>Zone:</span>
                <span>{ticket.zoneId}</span>
              </div>

              <div className='flex justify-between'>
                <span className='font-medium'>Gate:</span>
                <span>{gateId}</span>
              </div>

              <Separator />

              <div className='flex justify-between'>
                <span className='font-medium'>Check-in Time:</span>
                <span className='text-sm'>
                  {formatDateTime(ticket.checkinAt)}
                </span>
              </div>

              <Separator />

              <div className='text-center text-xs text-ring mt-4'>
                <p>Please keep this ticket for checkout</p>
                <p>Lost tickets may result in additional fees.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className='flex gap-2'>
          <Button variant='outline' className='flex-1'>
            <Printer className='h-4 w-4 mr-2' />
            Print
          </Button>
          <Button onClick={handleDownload} variant='outline' className='flex-1'>
            <Download className='h-4 w-4 mr-2' />
            Download
          </Button>
          <Button onClick={onClose} className='flex-1'>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
