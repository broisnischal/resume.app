import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

const ResumeList: React.FC<{ totalNumberOfResume: number }> = ({
	totalNumberOfResume,
}) => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			{totalNumberOfResume > 0 ? (
				<div className="flex flex-wrap max-w-[1200px] justify-center mx-auto gap-5">
					{/* Render your loading div based on the total number of resumes */}
					{Array.from({ length: totalNumberOfResume }).map((_, index) => (
						<div key={index} className="h-[200px]">
							<div className="flex items-center space-x-4">
								<Skeleton className="h-12 w-12 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[250px]" />
									<Skeleton className="h-4 w-[200px]" />
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div>No resumes available.</div>
			)}
		</Suspense>
	);
};

export default ResumeList;
