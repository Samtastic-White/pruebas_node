import { eventService } from './../../application/events/event.service';
import { z } from 'zod';

const eventSchema = z.object({
    name: z
        .string()
        .min(1, JSON.stringify())
        .max(255, JSON.stringify()),
    description: 

})