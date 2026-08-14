const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  const lead = await prisma.lead.findFirst({
    where: { customerName: process.env.LEAD_E2E_MARKER },
    include: { service: { select: { slug: true } } },
    orderBy: { createdAt: 'desc' },
  });
  if (!lead) throw new Error('Lead not found');
  console.log(JSON.stringify({ id: lead.id, leadCode: lead.leadCode, status: lead.status, serviceId: lead.serviceId, serviceName: lead.serviceName, serviceSlug: lead.service?.slug }));
  await prisma.$disconnect();
}
main().catch(error => { console.error(error); process.exitCode = 1; });
