class UploadsController < ApplicationController
  skip_before_action :authenticate_request, only: [:download_public]
  def new
    @upload = Upload.new
  end

  def create
    upload = @current_user.uploads.new(params.permit(:file))

    if upload.save
      render json: { status: 'SUCCESS', message: 'Uploaded in successfully'}, status: :ok
    else
      render :new
    end
  end

  def get
    files = []
    @current_user.uploads.each do |upload|
      filename = upload.file.attachment.blob.filename.to_s
      filesize = upload.file.attachment.blob.byte_size
      files.push({
        id: upload.id,
        name: filename,
        size: filesize,
        create_date: upload.created_at,
        is_public: upload.is_public
      })
    end
    render json: { status: 'SUCCESS', message: 'Uploaded in successfully', data: files }, status: :ok
  end

  def destroy
    upload = @current_user.uploads.find_by(id: params[:id])

    if upload&.destroy
      render json: { status: 'SUCCESS', message: 'File deleted successfully' }, status: :ok
    else
      render json: { status: 'ERROR', message: 'File not found or could not be deleted' }, status: :not_found
    end
  end

  def download
    upload = Upload.find_by(id: params[:id])

    if upload
      send_file upload.file.attachment.blob.service.send(:path_for, upload.file.attachment.blob.key),
                filename: upload.file.attachment.blob.filename.to_s,
                type: upload.file.attachment.blob.content_type
    else
      render json: { status: 'ERROR', message: 'File not found' }, status: :not_found
    end
  end

  def download_public
    upload = Upload.find_by(id: params[:id])

    if upload
      if upload.is_public
      send_file upload.file.attachment.blob.service.send(:path_for, upload.file.attachment.blob.key),
                filename: upload.file.attachment.blob.filename.to_s,
                type: upload.file.attachment.blob.content_type
      else
        render json: { status: 'UNAUTHORISED', message: 'File not public' }, status: :not_found
      end

    else
      render json: { status: 'ERROR', message: 'File not found' }, status: :not_found
    end
  end

  def make_public
    upload = @current_user.uploads.find_by(id: params[:id])

    if upload&.update(is_public: true)
      render json: { status: 'SUCCESS', message: 'File made public successfully' }, status: :ok
    else
      render json: { status: 'ERROR', message: 'File not found or could not be updated' }, status: :not_found
    end
  end

  def make_private
    upload = @current_user.uploads.find_by(id: params[:id])

    if upload&.update(is_public: false)
      render json: { status: 'SUCCESS', message: 'File made public successfully' }, status: :ok
    else
      render json: { status: 'ERROR', message: 'File not found or could not be updated' }, status: :not_found
    end
  end

  private

end
