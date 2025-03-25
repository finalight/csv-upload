import { count, like, or } from 'drizzle-orm';
import { FastifyPluginAsync } from "fastify";
import { db } from '../../db';
import { comments } from "../../db/schema";

interface CommentsQuery {
    limit?: string;  // `limit` is a string in query params
    page?: string; // `offset` is a string in query params
    searchterm?: string
}

const commentsRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (req, reply) {
        try {
            const { limit, page, searchterm: searchTerm } = req.query as CommentsQuery;

            const validatedLimit = limit ? Math.min(parseInt(limit, 10), 50) : 10;
            const validatedPage = page ? parseInt(page, 10) : 1;

            const offset = (validatedPage - 1) * validatedLimit;

            const baseQuery = db.select().from(comments);

            const hasSearch = searchTerm && searchTerm.trim() !== "";
            const searchCondition = hasSearch
                ? or(
                    like(comments.name, `%${searchTerm}%`),
                    like(comments.email, `%${searchTerm}%`),
                    like(comments.body, `%${searchTerm}%`)
                )
                : undefined;

            // Apply conditionally to results query
            const filteredQuery = hasSearch
                ? baseQuery.where(searchCondition)
                : baseQuery;

            const results = await filteredQuery.limit(validatedLimit).offset(offset);

            // Apply conditionally to count query
            const countQuery = db.select({ count: count() }).from(comments);
            const totalCountResult = hasSearch
                ? await countQuery.where(searchCondition)
                : await countQuery;

            const totalCount = totalCountResult[0].count;

            return reply.send({ data: results, total: totalCount, page: validatedPage, limit: validatedLimit });
        } catch (err: any) {
            return reply.code(500).send({ error: 'Error processing CSV file', details: err.message });
        }
    });
}

export default commentsRoute;
