const ProjectDetail = async ({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) => {
  const { slug } = await params;
  return <div>ProjectDetail {slug}</div>;
};

export default ProjectDetail;
