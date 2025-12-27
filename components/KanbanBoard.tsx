
import React from 'react';
import { KanbanStatus, Ticket } from '../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tickets: Ticket[];
  onMoveTicket: (id: string, status: KanbanStatus) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tickets, onMoveTicket }) => {
  return (
    <div className="px-8 mb-10 overflow-x-auto no-scrollbar">
      <div className="flex space-x-6 min-w-max pb-4">
        <KanbanColumn 
          title="New Requests" 
          status={KanbanStatus.NEW} 
          tickets={tickets.filter(t => t.status === KanbanStatus.NEW)} 
          glowColor="blue"
          onDropTicket={onMoveTicket}
        />
        <KanbanColumn 
          title="In Progress" 
          status={KanbanStatus.IN_PROGRESS} 
          tickets={tickets.filter(t => t.status === KanbanStatus.IN_PROGRESS)} 
          glowColor="yellow"
          onDropTicket={onMoveTicket}
        />
        <KanbanColumn 
          title="Repaired" 
          status={KanbanStatus.REPAIRED} 
          tickets={tickets.filter(t => t.status === KanbanStatus.REPAIRED)} 
          glowColor="emerald"
          onDropTicket={onMoveTicket}
        />
        <KanbanColumn 
          title="Scrap / Archive" 
          status={KanbanStatus.SCRAP} 
          tickets={tickets.filter(t => t.status === KanbanStatus.SCRAP)} 
          glowColor="red"
          onDropTicket={onMoveTicket}
          isScrapZone={true}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
