import * as csv from 'fast-csv';
import { FastifyPluginAsync } from "fastify";
import { comments } from "../../db/schema";
import { db } from '../../db';


const upload: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', async function (req, reply) {
    //@ts-ignore
    const data = await req.file();
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    // Handle the CSV file stream
    const csvStream = data.file;

    console.log('Processing CSV file...');

    const results: any[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        csvStream
          .pipe(csv.parse({ headers: true }))
          .on('data', (row: any) => {
            // console.log(row);
            results.push(row);
          })
          .on('end', () => {
            console.log('CSV file processed successfully.');
            resolve();
          })
          .on('error', (err: any) => {
            console.error('Error while processing CSV:', err);
            reject(err);
          });
      });

      //clear the table
      await db.delete(comments);

      // Batch insert into the database
      await db.insert(comments).values(
        results.map((row) => ({
          postId: parseInt(row.postId), // Make sure postId is an integer
          name: row.name,
          email: row.email,
          body: row.body,
        }))
      );


      return reply.send({ message: 'File uploaded and processed successfully', data: results });
    } catch (err: any) {
      return reply.code(500).send({ error: 'Error processing CSV file', details: err.message });
    }
  });
}

export default upload;
